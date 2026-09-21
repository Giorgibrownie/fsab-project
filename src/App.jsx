import { useState } from 'react'

// Eigenvalue and Eigenvector Calculator
function calculateEigen(matrix) {
  const { a, b, c, d } = matrix
  const trace = a + d
  const det = a * d - b * c
  const discriminant = trace * trace - 4 * det

  if (discriminant < -0.0001) {
    return { isReal: false, values: [], vectors: [] }
  }

  const sqrtDisc = Math.sqrt(Math.max(0, discriminant))
  const l1 = (trace + sqrtDisc) / 2
  const l2 = (trace - sqrtDisc) / 2

  const getVector = (lambda) => {
    if (Math.abs(c) > 0.0001) {
      return { x: lambda - d, y: c }
    } else if (Math.abs(b) > 0.0001) {
      return { x: -b, y: a - lambda }
    } else {
      return Math.abs(a - lambda) < 0.0001 ? { x: 1, y: 0 } : { x: 0, y: 1 }
    }
  }

  let v1 = getVector(l1)
  let v2 = getVector(l2)

  const len1 = Math.hypot(v1.x, v1.y) || 1
  const len2 = Math.hypot(v2.x, v2.y) || 1

  return {
    isReal: true,
    values: [l1, l2],
    vectors: [
      { x: v1.x / len1, y: v1.y / len1 },
      { x: v2.x / len2, y: v2.y / len2 },
    ],
    isDistinct: Math.abs(l1 - l2) > 0.0001,
  }
}

// Component 1: Matrix Controls
function MatrixControls({ matrix, setMatrix }) {
  const handleChange = (key, value) => {
    setMatrix((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }))
  }

  return (
    <div style={{ background: '#1e1e2e', padding: '1.2rem', borderRadius: '8px', color: '#cdd6f4' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Transformation Matrix A</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', maxWidth: '220px' }}>
        <div>
          <label>a: {matrix.a}</label>
          <input
            type="range" min="-3" max="3" step="0.1" value={matrix.a}
            onChange={(e) => handleChange('a', e.target.value)} style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>b: {matrix.b}</label>
          <input
            type="range" min="-3" max="3" step="0.1" value={matrix.b}
            onChange={(e) => handleChange('b', e.target.value)} style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>c: {matrix.c}</label>
          <input
            type="range" min="-3" max="3" step="0.1" value={matrix.c}
            onChange={(e) => handleChange('c', e.target.value)} style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>d: {matrix.d}</label>
          <input
            type="range" min="-3" max="3" step="0.1" value={matrix.d}
            onChange={(e) => handleChange('d', e.target.value)} style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}

// Component 2: Vector Controls
function VectorControls({ vector, setVector }) {
  const handleChange = (key, value) => {
    setVector((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }))
  }

  return (
    <div style={{ background: '#1e1e2e', padding: '1.2rem', borderRadius: '8px', color: '#cdd6f4', marginTop: '1rem' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Vector v (x, y)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', maxWidth: '220px' }}>
        <div>
          <label>x: {vector.x}</label>
          <input
            type="range" min="-5" max="5" step="0.5" value={vector.x}
            onChange={(e) => handleChange('x', e.target.value)} style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>y: {vector.y}</label>
          <input
            type="range" min="-5" max="5" step="0.5" value={vector.y}
            onChange={(e) => handleChange('y', e.target.value)} style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}

// Component 3: Preset Buttons
function PresetButtons({ setMatrix }) {
  const presets = [
    { name: 'Identity', m: { a: 1, b: 0, c: 0, d: 1 } },
    { name: 'Rotate 90°', m: { a: 0, b: -1, c: 1, d: 0 } },
    { name: 'Horizontal Shear', m: { a: 1, b: 1, c: 0, d: 1 } },
    { name: 'Scale 2x', m: { a: 2, b: 0, c: 0, d: 2 } },
    { name: 'Compress (det=0)', m: { a: 1, b: 1, c: 1, d: 1 } },
  ]

  return (
    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {presets.map((p) => (
        <button
          key={p.name} onClick={() => setMatrix(p.m)}
          style={{
            padding: '0.5rem 0.8rem', background: '#313244', color: '#cdd6f4',
            border: '1px solid #45475a', borderRadius: '4px', cursor: 'pointer',
          }}
        >
          {p.name}
        </button>
      ))}
    </div>
  )
}

// Component 4: Metrics & Eigenvalue Analysis Panel
function MetricsPanel({ matrix, eigenData, isAligned }) {
  const det = (matrix.a * matrix.d - matrix.b * matrix.c).toFixed(2)
  const isSingular = Math.abs(det) < 0.01

  return (
    <div style={{ background: '#1e1e2e', padding: '1.2rem', borderRadius: '8px', color: '#cdd6f4', marginTop: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Matrix Properties</h3>
      <p style={{ margin: '0.4rem 0' }}>
        <strong>Determinant det(A):</strong> {det}
      </p>

      <h4 style={{ margin: '0.8rem 0 0.4rem 0', color: '#a6e3a1' }}>Eigenspace Analysis</h4>
      {eigenData.isReal ? (
        <div>
          <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>
            λ₁ = {eigenData.values[0].toFixed(2)} | Vector: ({eigenData.vectors[0].x.toFixed(2)}, {eigenData.vectors[0].y.toFixed(2)})
          </p>
          {eigenData.isDistinct && (
            <p style={{ margin: '0.2rem 0', fontSize: '0.9rem' }}>
              λ₂ = {eigenData.values[1].toFixed(2)} | Vector: ({eigenData.vectors[1].x.toFixed(2)}, {eigenData.vectors[1].y.toFixed(2)})
            </p>
          )}
        </div>
      ) : (
        <p style={{ color: '#fab387', margin: '0.2rem 0', fontSize: '0.9rem' }}>
          Complex Eigenvalues (Space Rotates, No Real Eigenspaces)
        </p>
      )}

      {isAligned && (
        <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: '#f9e2af', color: '#11111b', borderRadius: '4px', fontWeight: 'bold', textAlign: 'center' }}>
          ✨ EIGENSPACE ALIGNED! A v = λ v (Pure Scaling)
        </div>
      )}

      {isSingular && (
        <p style={{ color: '#f38ba8', margin: '0.8rem 0 0 0', fontWeight: 'bold', fontSize: '0.85rem' }}>
          ⚠️ Singular Matrix: det(A) = 0.
        </p>
      )}
    </div>
  )
}

// Component 5: Canvas Visualizer with Dynamic Eigenspace Overlay
function GridVisualizer({ matrix, vector, eigenData, onAlignCheck }) {
  const transformedX = matrix.a * vector.x + matrix.b * vector.y
  const transformedY = matrix.c * vector.x + matrix.d * vector.y

  const maxVal = Math.max(
    Math.abs(vector.x), Math.abs(vector.y),
    Math.abs(transformedX), Math.abs(transformedY),
    4
  )

  const canvasWidth = 400
  const originX = canvasWidth / 2
  const originY = canvasWidth / 2
  const scale = (originX - 25) / maxVal

  const toSvgX = (x) => originX + x * scale
  const toSvgY = (y) => originY - y * scale

  // Alignment Check: Is user vector parallel to an eigenvector?
  let isAligned = false
  const vecLen = Math.hypot(vector.x, vector.y)
  if (eigenData.isReal && vecLen > 0.0001) {
    const uX = vector.x / vecLen
    const uY = vector.y / vecLen

    for (let ev of eigenData.vectors) {
      const dot = Math.abs(uX * ev.x + uY * ev.y)
      if (dot > 0.98) {
        isAligned = true
        break
      }
    }
  }

  // Update alignment state back to parent
  onAlignCheck(isAligned)

  const gridRange = Math.ceil(maxVal)
  const gridTicks = Array.from({ length: gridRange * 2 + 1 }, (_, i) => i - gridRange).filter((i) => i !== 0)

  return (
    <div style={{ background: '#11111b', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
      <svg width={canvasWidth} height={canvasWidth} style={{ border: '1px solid #313244' }}>
        {/* Dynamic Grid Ticks */}
        {gridTicks.map((tick) => (
          <g key={tick}>
            <line x1={toSvgX(tick)} y1={0} x2={toSvgX(tick)} y2={canvasWidth} stroke="#2a2b3d" strokeDasharray="2,2" />
            <line x1={0} y1={toSvgY(tick)} x2={canvasWidth} y2={toSvgY(tick)} stroke="#2a2b3d" strokeDasharray="2,2" />
          </g>
        ))}

        {/* Eigenspace Span Lines (Gold/Green Dashed) */}
        {eigenData.isReal && eigenData.vectors.map((ev, i) => {
          const farX = ev.x * maxVal * 2
          const farY = ev.y * maxVal * 2
          return (
            <line
              key={i}
              x1={toSvgX(-farX)} y1={toSvgY(-farY)}
              x2={toSvgX(farX)} y2={toSvgY(farY)}
              stroke={i === 0 ? '#a6e3a1' : '#94e2d5'}
              strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7"
            />
          )
        })}

        <line x1="0" y1={originY} x2={canvasWidth} y2={originY} stroke="#585b70" strokeWidth="2" />
        <line x1={originX} y1="0" x2={originX} y2={canvasWidth} stroke="#585b70" strokeWidth="2" />

        <line
          x1={originX} y1={originY} x2={toSvgX(vector.x)} y2={toSvgY(vector.y)}
          stroke={isAligned ? '#f9e2af' : '#89b4fa'} strokeWidth={isAligned ? '4' : '3'}
        />
        <circle cx={toSvgX(vector.x)} cy={toSvgY(vector.y)} r="5" fill={isAligned ? '#f9e2af' : '#89b4fa'} />

        <line
          x1={originX} y1={originY} x2={toSvgX(transformedX)} y2={toSvgY(transformedY)}
          stroke={isAligned ? '#fab387' : '#f38ba8'} strokeWidth={isAligned ? '4' : '3'}
        />
        <circle cx={toSvgX(transformedX)} cy={toSvgY(transformedY)} r="5" fill={isAligned ? '#fab387' : '#f38ba8'} />
      </svg>
    </div>
  )
}

// Main App Component
export default function App() {
  const [matrix, setMatrix] = useState({ a: 2, b: 1, c: 1, d: 2 })
  const [vector, setVector] = useState({ x: 2, y: 1 })
  const [isAligned, setIsAligned] = useState(false)

  const eigenData = calculateEigen(matrix)

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', background: '#181825', minHeight: '100vh', color: '#cdd6f4' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Linear Algebra Matrix Sandbox</h1>
      <p style={{ textAlign: 'center', color: '#a6adc8', marginBottom: '2rem' }}>
        Visualize 2D linear transformations & Eigenspaces in real time using React & SVG.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <MatrixControls matrix={matrix} setMatrix={setMatrix} />
          <VectorControls vector={vector} setVector={setVector} />
          <PresetButtons setMatrix={setMatrix} />
          <MetricsPanel matrix={matrix} eigenData={eigenData} isAligned={isAligned} />
        </div>
        <div>
          <GridVisualizer matrix={matrix} vector={vector} eigenData={eigenData} onAlignCheck={setIsAligned} />
          <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#a6adc8', textAlign: 'center' }}>
            <span style={{ color: '#89b4fa' }}>■ Original Vector</span> |{' '}
            <span style={{ color: '#f38ba8' }}>■ Transformed Vector</span> |{' '}
            <span style={{ color: '#a6e3a1' }}>--- Eigenspaces</span>
          </div>
        </div>
      </div>
    </div>
  )
}