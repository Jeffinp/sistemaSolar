import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { CelestialBodyData, SCALE, DISTANCE_SCALE } from "../data/planets";

interface CelestialBodyProps {
    data: CelestialBodyData;
    showOrbits: boolean;
    time: React.MutableRefObject<number>;
    isSelected?: boolean;  // Nova propriedade para indicar se o planeta está selecionado
}

export default function CelestialBody({ data, showOrbits, time, isSelected = false }: CelestialBodyProps) {
    const {
        id,
        radius,
        distance,
        rotationSpeed,
        revolutionSpeed,
        texture,
        tilt,
        hasRings,
        ringTexture,
        ringInnerRadius,
        ringOuterRadius } = data;

    const planetRef = useRef<THREE.Mesh>(null);
    const planetTexture = useTexture(texture);
    const orbitRef = useRef(null);
    const ringsRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    // Carregando texturas
    let ringTextureLoaded;
    if (hasRings && ringTexture) {
        ringTextureLoaded = useTexture(ringTexture);
    }

    // Para o Sol, normal map não é necessário
    const isSun = id === "sun";

    // Aplicar a escala de distância corretamente
    const scaledDistance = distance * DISTANCE_SCALE;

    // Rotação e revolução do planeta
    useFrame(() => {
        if (planetRef.current) {
            // Rotação do próprio planeta
            planetRef.current.rotation.y += rotationSpeed;

            // Revolução ao redor do sol
            if (distance > 0) {
                const angle = time.current * revolutionSpeed;
                planetRef.current.position.x = Math.cos(angle) * scaledDistance;
                planetRef.current.position.z = Math.sin(angle) * scaledDistance;
            }
        }

        // Atualizar atmosfera (se houver)
        if (atmosphereRef.current && distance > 0) {
            atmosphereRef.current.position.copy(planetRef.current?.position || new THREE.Vector3());
        }

        // Atualizar rotação dos anéis
        if (ringsRef.current && hasRings) {
            ringsRef.current.rotation.x = -0.5 * Math.PI;
            ringsRef.current.position.copy(planetRef.current?.position || new THREE.Vector3());
        }
    });

    // Criar órbita com distância escalada corretamente
    const orbitPoints = [];
    for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        orbitPoints.push(
            new THREE.Vector3(
                Math.cos(angle) * scaledDistance,
                0,
                Math.sin(angle) * scaledDistance
            )
        );
    }
    orbitPoints.push(orbitPoints[0].clone());
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    // Removing unused orbitMaterial variable as it's replaced by inline material in the primitive component

    return (
        <>
            {/* Órbita - Destacada se o planeta estiver selecionado */}
            {distance > 0 && showOrbits && (
                <primitive
                    object={new THREE.Line(
                        orbitGeometry,
                        new THREE.LineBasicMaterial({
                            color: isSelected ? "#ffff00" : "#ffffff",
                            opacity: isSelected ? 0.6 : 0.3,
                            transparent: true,
                            blending: THREE.AdditiveBlending,
                            linewidth: isSelected ? 2 : 1
                        })
                    )}
                    ref={orbitRef}
                />
            )}

            {/* Planeta - não renderizar o Sol aqui, já que ele tem seu próprio componente especializado */}
            {!isSun && (
                <mesh
                    ref={planetRef}
                    position={[distance > 0 ? scaledDistance : 0, 0, 0]}
                    rotation={[0, 0, tilt * (Math.PI / 180)]}
                    castShadow={true}
                    receiveShadow={true}
                >
                    <sphereGeometry args={[radius * SCALE / 10, 64, 64]} />
                    <meshPhysicalMaterial
                        map={planetTexture}
                        roughness={0.65}
                        metalness={0.1}
                        clearcoat={0.2}
                        clearcoatRoughness={0.4}
                        emissive={isSelected ? new THREE.Color("#555500") : new THREE.Color("#000000")}
                        emissiveIntensity={isSelected ? 0.2 : 0}
                    />
                </mesh>
            )}

            {/* Indicador de seleção (anel de destaque) */}
            {isSelected && !isSun && (
                <mesh
                    position={[distance > 0 ? scaledDistance : 0, 0, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <ringGeometry args={[
                        (radius * SCALE / 10) * 1.2,
                        (radius * SCALE / 10) * 1.3,
                        32
                    ]} />
                    <meshBasicMaterial
                        color="#FFFF00"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Atmosfera para planetas com atmosfera */}
            {distance > 0 && (id === "earth" || id === "venus" || id === "titan") && (
                <mesh
                    ref={atmosphereRef}
                    position={[scaledDistance, 0, 0]}
                    scale={1.05}
                >
                    <sphereGeometry args={[radius * SCALE / 10, 32, 32]} />
                    <meshLambertMaterial
                        color={id === "earth" ? "#88aaff" : (id === "venus" ? "#ffaa44" : "#aaaaaa")}
                        transparent
                        opacity={0.15}
                        side={THREE.BackSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {/* Anéis (se houver) */}
            {hasRings && ringTextureLoaded && (
                <mesh
                    ref={ringsRef}
                    position={[scaledDistance, 0, 0]}
                    receiveShadow
                    castShadow
                >
                    <ringGeometry
                        args={[
                            (ringInnerRadius || (radius * 1.5)) * SCALE / 10,
                            (ringOuterRadius || (radius * 2.5)) * SCALE / 10,
                            64
                        ]}
                    />
                    <meshStandardMaterial
                        map={ringTextureLoaded}
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.9}
                        roughness={0.7}
                        metalness={0.1}
                    />
                </mesh>
            )}
        </>
    );
}