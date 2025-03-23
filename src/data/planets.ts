export interface CelestialBodyData {
    id: string;
    name: string;
    radius: number;
    distance: number; // distância do sol em UA (Unidade Astronômica)
    rotationSpeed: number;
    revolutionSpeed: number;
    texture: string;
    tilt: number;
    hasRings?: boolean;
    ringTexture?: string;
    ringInnerRadius?: number;
    ringOuterRadius?: number;
    description: string;
    color?: string; // Cor para iluminação
}

export const celestialBodies: CelestialBodyData[] = [
    {
        id: "sun",
        name: "Sol",
        radius: 12,  // Mantido para informações no painel, mas não exibido como planeta normal
        distance: 0,
        rotationSpeed: 0.004,
        revolutionSpeed: 0,
        texture: "/assets/textures/sun.jpg",
        tilt: 0,
        description: "O Sol é a estrela central do Sistema Solar.",
        color: "#FDB813"
    },
    {
        id: "mercury",
        name: "Mercúrio",
        radius: 0.38,
        distance: 3.8,  // Distância aumentada para evitar sobreposição
        rotationSpeed: 0.004,
        revolutionSpeed: 0.04,
        texture: "/assets/textures/mercury.jpg",
        tilt: 0.034,
        description: "Mercúrio é o menor e mais interno planeta do Sistema Solar."
    },
    {
        id: "venus",
        name: "Vênus",
        radius: 0.95,
        distance: 6.2,  // Distância aumentada
        rotationSpeed: 0.002,
        revolutionSpeed: 0.015,
        texture: "/assets/textures/venus.jpg",
        tilt: 177.4,
        description: "Vênus é o segundo planeta do Sistema Solar em ordem de distância do Sol."
    },
    {
        id: "earth",
        name: "Terra",
        radius: 1,
        distance: 8.5,  // Distância aumentada
        rotationSpeed: 0.01,
        revolutionSpeed: 0.01,
        texture: "/assets/textures/earth.jpg",
        tilt: 23.5,
        description: "Terra é o terceiro planeta do Sistema Solar e o único conhecido a abrigar vida."
    },
    {
        id: "mars",
        name: "Marte",
        radius: 0.53,
        distance: 11,  // Distância aumentada
        rotationSpeed: 0.01,
        revolutionSpeed: 0.008,
        texture: "/assets/textures/mars.jpg",
        tilt: 25.2,
        description: "Marte é o quarto planeta do Sistema Solar, conhecido como o Planeta Vermelho."
    },
    {
        id: "jupiter",
        name: "Júpiter",
        radius: 11.2,
        distance: 16, // Corrigido para ficar após Marte
        rotationSpeed: 0.04,
        revolutionSpeed: 0.002,
        texture: "/assets/textures/jupiter.jpg",
        tilt: 3.13,
        description: "Júpiter é o maior planeta do Sistema Solar, um gigante gasoso."
    },
    {
        id: "saturn",
        name: "Saturno",
        radius: 9.45,
        distance: 22, // Corrigido para ficar após Júpiter
        rotationSpeed: 0.038,
        revolutionSpeed: 0.0009,
        texture: "/assets/textures/saturn.jpg",
        tilt: 26.7,
        hasRings: true,
        ringTexture: "/assets/textures/saturn-ring.png",
        ringInnerRadius: 10,
        ringOuterRadius: 20,
        description: "Saturno é o sexto planeta do Sistema Solar, conhecido por seus anéis."
    },
    {
        id: "uranus",
        name: "Urano",
        radius: 4,
        distance: 30, // Ajustado ligeiramente para manter proporção
        rotationSpeed: 0.03,
        revolutionSpeed: 0.0004,
        texture: "/assets/textures/uranus.jpg",
        tilt: 97.8,
        description: "Urano é o sétimo planeta do Sistema Solar, um gigante de gelo."
    },
    {
        id: "neptune",
        name: "Netuno",
        radius: 3.88,
        distance: 38, // Ajustado para manter proporção
        rotationSpeed: 0.032,
        revolutionSpeed: 0.0001,
        texture: "/assets/textures/neptune.jpg",
        tilt: 28.3,
        description: "Netuno é o oitavo e mais distante planeta conhecido do Sistema Solar."
    }
];

// Escala dos tamanhos para melhor visualização
export const SCALE = 5;
// Fator para distância (para não ficarem muito distantes na visualização)
export const DISTANCE_SCALE = 3; // Ajustado para melhor distribuição considerando as novas distâncias