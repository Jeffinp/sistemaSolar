import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CelestialBodyData, DISTANCE_SCALE } from "../data/planets";

interface ControlsProps {
    cameraPosition?: [number, number, number];
    selectedPlanet: CelestialBodyData;
    time: React.MutableRefObject<number>;
}

export default function Controls({
    cameraPosition = [0, 30, 80],
    selectedPlanet,
    time
}: ControlsProps) {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);
    const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(0, 0, 0));
    const [cameraTargetPosition, setCameraTargetPosition] = useState(new THREE.Vector3(...cameraPosition));
    const lastPlanetId = useRef(selectedPlanet.id);

    // Calcular a posição do planeta selecionado
    useEffect(() => {
        if (selectedPlanet.id === "sun") {
            // Focar no sol (origem)
            setTargetPosition(new THREE.Vector3(0, 0, 0));

            // Posição da câmera para o sol (mais afastada para ver todo o sistema)
            setCameraTargetPosition(new THREE.Vector3(0, 30, 80));
        } else {
            // Para planetas, calcular sua posição orbital atual
            const angle = time.current * selectedPlanet.revolutionSpeed;
            const distance = selectedPlanet.distance * DISTANCE_SCALE;

            // Posição do planeta na órbita
            const planetX = Math.cos(angle) * distance;
            const planetZ = Math.sin(angle) * distance;
            setTargetPosition(new THREE.Vector3(planetX, 0, planetZ));

            // Calcular uma boa posição para a câmera baseada no planeta
            // Afastada ligeiramente para ter uma boa visualização
            const cameraDistance = 5 + selectedPlanet.radius * 2;
            const cameraX = planetX - Math.cos(angle) * cameraDistance;
            const cameraY = 2 + selectedPlanet.radius * 0.5;
            const cameraZ = planetZ - Math.sin(angle) * cameraDistance;
            setCameraTargetPosition(new THREE.Vector3(cameraX, cameraY, cameraZ));
        }

        lastPlanetId.current = selectedPlanet.id;
    }, [selectedPlanet, time.current]);

    // Transição suave da câmera para a nova posição/alvo
    useFrame(() => {
        if (controlsRef.current) {
            // Interpolar suavemente a posição atual do target para a nova posição
            controlsRef.current.target.lerp(targetPosition, 0.05);

            // Interpolar suavemente a posição da câmera para a nova posição
            camera.position.lerp(cameraTargetPosition, 0.05);

            // Garantir que os controles atualizem em tempo real
            controlsRef.current.update();
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={cameraPosition} />
            <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                zoomSpeed={0.6}
                panSpeed={0.5}
                rotateSpeed={0.4}
                minDistance={5}
                maxDistance={250}
                target={[0, 0, 0]}
            />
        </>
    );
}