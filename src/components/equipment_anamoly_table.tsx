import { Equipment_anamoly } from "../types/equipment_anamoly.types"
import { useCsvData } from "../hooks/useCsvData"
import {isValidEquipmentAnamoly} from '../../public/data/schema/equipment_anamoly_validator'
import {useState, useMemo} from 'react'
import './equipment_anamoly_table.css'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ScatterChart,
  ReferenceArea,
  Scatter
} from "recharts"

type DotPlotPoint = {
  name: string;
  value: number;
};

const DotPlot = ({ data }: { data: DotPlotPoint[] }) => (
  <ResponsiveContainer width="100%" height={260}>
    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 80 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <ReferenceArea x1={0} x2={80} fill="#dcfce7" fillOpacity={0.6} />
      <ReferenceArea x1={80} x2={120} fill="#fef3c7" fillOpacity={0.6} />
      <ReferenceArea x1={120} x2={200} fill="#fee2e2" fillOpacity={0.6} />

      <XAxis type="number" dataKey="value" domain={[0, 200]} />
      <YAxis type="category" dataKey="name" width={120} />

<Tooltip
  content={({ payload }) => {
    if (!payload || payload.length === 0) return null;

    const value = payload[0].value;

    return (
      <div
        style={{
          background: "#0f172a",
          color: "#f8fafc",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "12px",
        }}
      >
        {typeof value === "number" ? value.toFixed(2) : "-"}
      </div>
    );
  }}
/>
      {/* <Tooltip 
  formatter={(value?: number) =>
    typeof value === "number" ? value.toFixed(2) : "-"
  }
/> */}
    <Scatter data={data} fill="#2563eb" shape="circle" />
    </ScatterChart>
  </ResponsiveContainer>
);


export function Equipment_anamoly_table(){
const CSV_URL = `${import.meta.env.BASE_URL}data/csv/equipment_anomaly_data.csv`

const [currentPage, setCurrentPage] = useState(1);
const [selectedLocation, setSelectedLocation] = useState("");
const [selectedEquipment, setSelectedEquipment] = useState("");
const [showOnlyFaulty, setShowOnlyFaulty] = useState(false);
const rowsPerPage = 5;
  const { data, loading, error } =
    useCsvData<Equipment_anamoly>(CSV_URL,isValidEquipmentAnamoly)
  const location = useMemo(() => Array.from(new Set(data.map(d => d.location))),[data]);
  const equipment = useMemo(() => Array.from(new Set(data.map(d => d.equipment))),[data]);

const PARAM_THRESHOLDS = {
  temperature: { safe: 80, warning: 120, max: 180 },
  pressure: { safe: 30, warning: 50, max: 80 },
  vibration: { safe: 0.3, warning: 0.6, max: 1 },
  humidity: { safe: 60, warning: 75, max: 100 },
};
const [selectedRow, setSelectedRow] = useState<Equipment_anamoly | null>(null);

const baseFilteredData = useMemo(() => {
  return data.filter(row => {
    const locationMatch =
      !selectedLocation || row.location === selectedLocation;

    const equipmentMatch =
      !selectedEquipment || row.equipment === selectedEquipment;

    return locationMatch && equipmentMatch;
  });
}, [data, selectedLocation, selectedEquipment]);

const tableFilteredData = useMemo(() => {
  return baseFilteredData.filter(row => {
    return !showOnlyFaulty || row.faulty === 1;
  });
}, [baseFilteredData, showOnlyFaulty]);

  const equipmentHealthPieData = useMemo(() => {
  const source = baseFilteredData 

  const faultyCount = source.filter(row => row.faulty === 1).length
  const healthyCount = source.filter(row => row.faulty === 0).length

  return [
    { name: "Non-Faulty", value: healthyCount },
    { name: "Faulty", value: faultyCount },
  ].filter(d => d.value > 0)
}, [baseFilteredData])

const healthPieTitle = selectedLocation && selectedEquipment
  ? `Health Status of ${selectedEquipment} at ${selectedLocation}`
  : selectedLocation
  ? `Equipment Health Status at ${selectedLocation}`
  : "Overall Equipment Health Status"

  const locationEquipmentPieData = useMemo(() => {
  const counts: Record<string, number> = {}
  
  if (!selectedLocation) {
    data.forEach(row => {
      counts[row.location] = (counts[row.location] || 0) + 1
    })
  }
  else {
    data
      .filter(row => row.location === selectedLocation)
      .forEach(row => {
        counts[row.equipment] = (counts[row.equipment] || 0) + 1
      })
  }

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }))
}, [data, selectedLocation])

const faultyEquipmentVsLocationBarData = useMemo(() => {
  const faultyRows = data.filter(row => Number(row.faulty) === 1)

  const scopedRows = faultyRows.filter(row => {
    const locationMatch =
      !selectedLocation || row.location === selectedLocation
    const equipmentMatch =
      !selectedEquipment || row.equipment === selectedEquipment

    return locationMatch && equipmentMatch
  })

  const grouped: Record<string, Record<string, number>> = {}

  scopedRows.forEach(row => {
    if (!grouped[row.equipment]) {
      grouped[row.equipment] = {}
    }
    grouped[row.equipment][row.location] =
      (grouped[row.equipment][row.location] || 0) + 1
  })

  return Object.entries(grouped).map(([equipment, locations]) => ({
    equipment,
    ...locations,
  }))
}, [data, selectedLocation, selectedEquipment])

const faultyLocations = useMemo(() => {
  return Array.from(
    new Set(
      data
        .filter(row => Number(row.faulty) === 1)
        .map(row => row.location)
    )
  )
}, [data])



  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = tableFilteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tableFilteredData.length / rowsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
    setCurrentPage(1);
  };
  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEquipment(e.target.value);
    setCurrentPage(1);
  };

  const PIE_COLORS = ["#6366f1", "#964B00", "#f59e0b", "#ef4444", "#14b8a6"]

  const dotPlotData = useMemo(() => {
  if (!selectedRow) return [];

  return [
    { name: "Temperature", key: "temperature", value: selectedRow.temperature },
    { name: "Pressure", key: "pressure", value: selectedRow.pressure },
    { name: "Vibration", key: "vibration", value: selectedRow.vibration },
    { name: "Humidity", key: "humidity", value: selectedRow.humidity },
  ];
}, [selectedRow]);


  if (loading) return <p>Loading CSV...</p>
  if (error) return <p>Failed to load CSV</p>

  return (
    <>
    <div className="wrap">
    <div className="filters">
        <select value={selectedLocation} onChange={handleLocationChange}>
          <option value="">All Locations</option>
          {location.map(loc => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select value={selectedEquipment} onChange={handleEquipmentChange}>
          <option value="">All Equipments</option>
          {equipment.map(eq => (
            <option key={eq} value={eq}>
              {eq}
            </option>
          ))}
        </select>
      </div>

    <div className="table-container">
        
    <table>
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Temperature</th>
          <th>Pressure</th>
          <th>Vibration</th>
          <th>Humidity</th>
          <th>Equipment</th>
          <th>Location</th>
          <th>
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
                type="checkbox"
                checked={showOnlyFaulty}
                onChange={(e) => {
                setShowOnlyFaulty(e.target.checked);
                setCurrentPage(1); // reset pagination on filter change
                }}
            />
            Faulty
            </label>
          </th>
        </tr>
      </thead>
      <tbody>
        {currentRows.map((row, idx) => (
            <tr key={indexOfFirstRow + idx}
            onClick={() => setSelectedRow(row)}
            style={{ cursor: "pointer" }}>

              <td>{indexOfFirstRow + idx + 1}</td>
              <td>{Number(row.temperature).toFixed(2)}</td>
              <td>{Number(row.pressure).toFixed(2)}</td>
              <td>{Number(row.vibration).toFixed(2)}</td>
              <td>{Number(row.humidity).toFixed(2)}</td>
              <td>{row.equipment}</td>
              <td>{row.location}</td>
              <td>{row.faulty}</td>
            </tr>
          ))}
        {currentRows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            )}

      </tbody>
    </table>
    {selectedRow && (
  <div className="modal-backdrop" onClick={() => setSelectedRow(null)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>
          {selectedRow.equipment} – {selectedRow.location}
        </h3>
        <button onClick={() => setSelectedRow(null)}>✕</button>
      </div>

      <p className="modal-subtitle">
        Parameter deviation snapshot
      </p>

      <DotPlot data={dotPlotData} />

      <div className="legend">
        <span className="safe">Safe</span>
        <span className="warning">Warning</span>
        <span className="critical">Critical</span>
      </div>
    </div>
  </div>
)}
    <div className="pagination">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <span> Page {currentPage} of {totalPages} </span>

        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      </div>
      <div className="charts-grid">
  <div className="chart-section">
    <h3 className="chart-title">{healthPieTitle}</h3>

    {equipmentHealthPieData.length === 0 ? (
      <div className="chart-empty">No data available</div>
    ) : (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={equipmentHealthPieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, percent }) =>
              `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
            }
          >
            {equipmentHealthPieData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.name === "Faulty"
                    ? "#ef4444"   
                    : "#22c55e"   
                }
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    )}
  </div>
  <div className="chart-section">
  <h3 className="chart-title">
    Faulty Equipments Count by Location
  </h3>

  {faultyEquipmentVsLocationBarData.length === 0 ? (
    <div className="chart-empty">No faulty equipment detected</div>
  ) : (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={faultyEquipmentVsLocationBarData}
        margin={{ top: 16, right: 24, left: 8, bottom: 16 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="equipment" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />

        {faultyLocations.map((loc, index) => (
          <Bar
            key={loc}
            dataKey={loc}
            name={loc}
            fill={PIE_COLORS[index % PIE_COLORS.length]}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )}
</div>
</div>
</div>
</>
  )
}