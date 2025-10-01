import React from 'react';
import './DataBox.css';

const DataBox = ({ title, average, highest, lowest, children }) => {
  return (
    <div className="dataBox">
      <div className="dataTitleBox">{title}</div>
      {children && <div className="graph">{children}</div>}
      <div className="dataBoard">
        <div className="dataRow">
          <div className="dataRowTitleBox">평균</div>
          <div className="dataRowValue">{average}</div>
        </div>
        <div className="dataRow">
          <div className="dataRowTitleBox">최고</div>
          <div className="dataRowValue">{highest}</div>
        </div>
        <div className="dataRow">
          <div className="dataRowTitleBox">최저</div>
          <div className="dataRowValue">{lowest}</div>
        </div>
      </div>
    </div>
  );
};

export default DataBox;