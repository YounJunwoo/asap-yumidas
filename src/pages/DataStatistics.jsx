// src/pages/DataStatistics.jsx
import './DataStatistics.css';
import DataBox from '../components/DataBox';
import Graph from '../components/copy_Graph';
import useGraphData from '../hooks/useGraphData';
import useSummaryBox from '../hooks/useSummaryBox';

const DataStatistics = () => {
  const tempGraph = useGraphData('temperature');
  const humGraph = useGraphData('humidity');

  const tempSummary = useSummaryBox('temperature');
  const humSummary = useSummaryBox('humidity');

  return (
    <div className="dataStatistics">
      <div className="dataBoxGrid">
        <DataBox
          title="온도°C"
          average={tempSummary.average}
          highest={tempSummary.highest}
          lowest={tempSummary.lowest}
        >
          <Graph data={tempGraph.data} title="온도°C" label="온도" color="#87ceeB" />
        </DataBox>

        <DataBox
          title="습도 %"
          average={humSummary.average}
          highest={humSummary.highest}
          lowest={humSummary.lowest}
        >
          <Graph data={humGraph.data} title="습도 %" label="습도" color="#87ceeB" />
        </DataBox>
      </div>
    </div>
  );
};

export default DataStatistics;

