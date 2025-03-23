import { useState } from 'react';
import SolarSystem from './components/SolarSystem';
import { celestialBodies } from './data/planets';

function App() {
  const [showOrbits, setShowOrbits] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(celestialBodies[0]);

  return (
    <div className="w-full h-full relative">
      {/* Sistema Solar 3D - Passando o planeta selecionado */}
      <SolarSystem
        showOrbits={showOrbits}
        showStats={showStats}
        selectedPlanet={selectedPlanet}
      />

      {/* Painel de controle */}
      <div className="controls">
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(e) => setShowOrbits(e.target.checked)}
              className="form-checkbox"
            />
            <span>Mostrar órbitas</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showStats}
              onChange={(e) => setShowStats(e.target.checked)}
              className="form-checkbox"
            />
            <span>Mostrar estatísticas</span>
          </label>
        </div>

        <div>
          <label className="block mb-2">Selecione um planeta:</label>
          <select
            value={selectedPlanet.id}
            onChange={(e) => {
              const selected = celestialBodies.find(body => body.id === e.target.value);
              if (selected) setSelectedPlanet(selected);
            }}
            className="bg-black border border-gray-400 rounded px-2 py-1 w-full"
          >
            {celestialBodies.map(body => (
              <option key={body.id} value={body.id}>
                {body.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Painel de informações */}
      <div className="info-panel">
        <h2 className="text-xl font-bold mb-2">{selectedPlanet.name}</h2>
        <p className="mb-4">{selectedPlanet.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Raio:</div>
          <div>{selectedPlanet.radius} (Terra = 1)</div>

          <div>Distância:</div>
          <div>{selectedPlanet.distance} UA</div>

          <div>Inclinação:</div>
          <div>{selectedPlanet.tilt}°</div>
        </div>
      </div>
    </div>
  );
}

export default App;
