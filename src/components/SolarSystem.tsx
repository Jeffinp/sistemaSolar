import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats, Sphere, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, SMAA, ToneMapping } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Lensflare, LensflareElement } from "three/examples/jsm/objects/Lensflare.js";
import CelestialBody from "./CelestialBody";
import Controls from "./Controls";
import Stars from "./Stars";
import { celestialBodies, CelestialBodyData } from "../data/planets";
import * as THREE from "three";

// Componente para atualizar o tempo no sistema solar com controle de velocidade
function TimeUpdater({ time }: { time: React.MutableRefObject<number> }) {
    const [simulationSpeed] = useState(0.1);

    useFrame((_, delta) => {
        time.current += delta * simulationSpeed;
    });
    return null;
}

// Converter temperatura Kelvin para cor RGB
function kelvinToRGB(kelvin: number): string {
    // Algoritmo baseado em aproximações para converter temperatura em cor
    kelvin = kelvin / 100;
    let r, g, b;

    // Vermelho
    if (kelvin <= 66) {
        r = 255;
    } else {
        r = kelvin - 60;
        r = 329.698727446 * Math.pow(r, -0.1332047592);
        r = Math.max(0, Math.min(255, r));
    }

    // Verde
    if (kelvin <= 66) {
        g = kelvin;
        g = 99.4708025861 * Math.log(g) - 161.1195681661;
    } else {
        g = kelvin - 60;
        g = 288.1221695283 * Math.pow(g, -0.0755148492);
    }
    g = Math.max(0, Math.min(255, g));

    // Azul
    if (kelvin >= 66) {
        b = 255;
    } else if (kelvin <= 19) {
        b = 0;
    } else {
        b = kelvin - 10;
        b = 138.5177312231 * Math.log(b) - 305.0447927307;
        b = Math.max(0, Math.min(255, b));
    }

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// Componente para renderização avançada do Sol com física de luz realista
function SunLight() {
    const sunRef = useRef<THREE.PointLight>(null);
    const sunTextureMap = useTexture("/src/assets/textures/sun.jpg");

    // Texturas para o efeito de lensflare
    const texture0 = useTexture("/src/assets/textures/lensflare.png");
    const texture1 = useTexture("/src/assets/textures/lensflare.png");

    // Temperatura do sol em Kelvin
    const sunTemperature = 5778;
    const sunColor = kelvinToRGB(sunTemperature);

    useEffect(() => {
        if (!sunRef.current) return;

        // Configurar o Lensflare com oclusão correta
        const lensflare = new Lensflare();

        // Elemento principal do lensflare
        lensflare.addElement(
            new LensflareElement(
                texture0,
                300, // tamanho 
                0, // distância da origem
                new THREE.Color(sunColor)
            )
        );

        // Elementos secundários do lensflare (mais sutis)
        lensflare.addElement(
            new LensflareElement(
                texture1,
                60,
                0.6,
                new THREE.Color('#FFDDAA')
            )
        );

        lensflare.addElement(
            new LensflareElement(
                texture1,
                70,
                0.7,
                new THREE.Color('#FFAA66')
            )
        );

        lensflare.addElement(
            new LensflareElement(
                texture1,
                120,
                0.9,
                new THREE.Color('#AA8866')
            )
        );

        // Adicionar lensflare à luz do sol
        sunRef.current.add(lensflare);

        return () => {
            // Limpeza ao desmontar
            if (sunRef.current) {
                const lensflareToRemove = sunRef.current.children.find(
                    child => child instanceof Lensflare
                );
                if (lensflareToRemove) {
                    sunRef.current.remove(lensflareToRemove);
                }
            }
        };
    }, [sunRef, texture0, texture1, sunColor]);

    // Efeito de pulsação suave do Sol
    const pulseRef = useRef<{ value: number }>({ value: 0 });

    useFrame((_, delta) => {
        if (sunRef.current) {
            // Simulação de pulsação solar mais sutil e natural
            pulseRef.current.value += delta * 0.5;
            const pulseFactor = Math.sin(pulseRef.current.value) * 0.2 + 1;

            // Ajustar intensidade da luz com pulsação
            sunRef.current.intensity = 2.5 * pulseFactor;
        }
    });

    return (
        <>
            {/* Luz principal do sol com temperatura de cor física (~5778K) */}
            <pointLight
                ref={sunRef}
                position={[0, 0, 0]}
                intensity={2.5}
                color={sunColor}
                distance={200}
                decay={1.5}
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-bias={-0.0005}
                shadow-radius={1.5}
            />

            {/* Luz ambiente para simular o reflexo geral da luz no espaço */}
            <ambientLight intensity={0.12} color="#F8EDEB" />

            {/* Luz hemisférica para gradiente de iluminação realista */}
            <hemisphereLight
                intensity={0.18}
                color="#FFF9E3"
                groundColor="#000033"
            />

            {/* Núcleo solar com emissão realista baseada na textura */}
            <Sphere args={[5.8, 64, 64]} position={[0, 0, 0]}>
                <meshPhysicalMaterial
                    map={sunTextureMap}
                    emissiveMap={sunTextureMap}
                    emissive={sunColor}
                    emissiveIntensity={1.2}
                    toneMapped={false}
                    roughness={0.3}
                    metalness={0}
                    clearcoat={0.2}
                    clearcoatRoughness={0.4}
                    transmission={0.1}
                />
            </Sphere>

            {/* Corona solar (camada externa) */}
            <Sphere args={[6.2, 32, 32]} position={[0, 0, 0]}>
                <meshBasicMaterial
                    color="#FDB813"
                    transparent={true}
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Sphere>

            {/* Efeito de glow difuso do Sol */}
            <Sphere args={[8, 64, 64]} position={[0, 0, 0]}>
                <meshBasicMaterial
                    map={sunTextureMap}
                    color="#FDB813"
                    transparent={true}
                    opacity={0.07}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Sphere>
        </>
    );
}

interface SolarSystemProps {
    showOrbits: boolean;
    showStats: boolean;
    selectedPlanet: CelestialBodyData;
}

export default function SolarSystem({
    showOrbits = true,
    showStats = false,
    selectedPlanet
}: SolarSystemProps) {
    const time = useRef(0);

    return (
        <Canvas
            shadows={{
                type: THREE.PCFSoftShadowMap,
                enabled: true,
                autoUpdate: true
            }}
            gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 0.9,
                outputColorSpace: THREE.SRGBColorSpace
            }}
            camera={{ fov: 60, far: 2000 }}
            className="w-full h-full"
        >
            {/* Atualizador de tempo */}
            <TimeUpdater time={time} />

            {/* Sistema de iluminação solar */}
            <SunLight />

            {/* Controles de câmera - Agora recebe o planeta selecionado */}
            <Controls
                cameraPosition={[0, 30, 80]}
                selectedPlanet={selectedPlanet}
                time={time}
            />

            {/* Fundo de estrelas */}
            <Stars />

            {/* Corpos celestes */}
            {celestialBodies.map(body => (
                <CelestialBody
                    key={body.id}
                    data={body}
                    showOrbits={showOrbits}
                    time={time}
                    isSelected={body.id === selectedPlanet.id}
                />
            ))}

            {/* Efeitos de pós-processamento otimizados */}
            <EffectComposer multisampling={0} enableNormalPass={false}>
                <Bloom
                    intensity={1.2}
                    luminanceThreshold={0.7}
                    luminanceSmoothing={0.4}
                    mipmapBlur
                    radius={0.7}
                />
                <SMAA />
                <ToneMapping
                    blendFunction={BlendFunction.NORMAL}
                    adaptive={true}
                    resolution={256}
                    middleGrey={0.6}
                    maxLuminance={12.0}
                    averageLuminance={1.0}
                    adaptationRate={1.0}
                />
            </EffectComposer>

            {/* Stats (opcional) */}
            {showStats && <Stats />}
        </Canvas>
    );
}