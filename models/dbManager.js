class DbManager {
  data = [];
  column = [];

  /**
   * @param {Array} datas
   * @return {null}
   */

  setData = (datas) => {
    this.data = datas;
    this.columns = Object.keys(datas[0]);
    // console.log(this.data, this.columns);
  };

  /**
   * @param {Element} tableElement
   * @param {Array} columnList
   * @param {Boolean} viewRowNum
   * @return {Object}
   */

  createTableEl = (tableElement, columnList = [], viewRowNum = false) => {
    const columns = [...this.columns];
    const datas = [...this.data];
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const trs = [];
    const ths = [];

    const isInclude = (val) => {
      if (columnList.length === 0) return true;

      return columnList.indexOf(val) < 0 ? false : true;
    };
    //
    columns.map((column) => {
      if (isInclude(column)) {
        const th = document.createElement("th");
        th.setAttribute("scope", "col");
        th.innerHTML = column;
        thead.appendChild(th);
        ths.push(th);
      }
    });

    datas.map((rowData, row) => {
      const tr = document.createElement("tr");
      if (viewRowNum) {
        const th = document.createElement("th");
        th.setAttribute("scope", row);
        th.innerHTML = row + 1;
        tr.appendChild(th);
        trs.push(tr);
      }
      // {}
      for (const key in rowData) {
        if (isInclude(key)) {
          const val = rowData[key];
          const td = document.createElement("td");
          td.innerHTML = val;
          tr.appendChild(td);
        }
      }
      tbody.appendChild(tr);
    });
    tableElement.appendChild(thead);
    tableElement.appendChild(tbody);
    return { trs: trs };
  };
}

// module.exports = DbManager;
