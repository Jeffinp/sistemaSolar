import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

export default function Stars() {
    const texture = useTexture("/src/assets/textures/stars.jpg");
    
    // Gerar estrelas adicionais para um efeito mais denso
    const starPositions = useMemo(() => {
        const positions = [];
        // Gerar 2000 estrelas aleatórias
        for (let i = 0; i < 2000; i++) {
            // Distribuir em uma esfera
            const r = 800; // Raio ligeiramente menor que a skybox
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            positions.push(x, y, z);
        }
        return new Float32Array(positions);
    }, []);
    
    return (
        <>
            {/* Skybox com textura de estrelas */}
            <mesh>
                <sphereGeometry args={[900, 64, 64]} />
                <meshBasicMaterial
                    map={texture}
                    side={THREE.BackSide}
                    fog={false}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            
            {/* Pontos de estrelas adicionais */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[starPositions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial 
                    size={1.5} 
                    color="#ffffff" 
                    sizeAttenuation
                    transparent
                    opacity={0.8}
                    fog={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </>
    );
}