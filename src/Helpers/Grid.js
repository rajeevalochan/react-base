import ReactDOM from "react-dom";
import _ from "lodash";
import {
  getGridRecords,
  deleteGridRecord
} from "../actions/GridActions";

class Grid {
  /**
   * Get instance for utitlity
   *
   * @param object
   * @param callback
   * @return object
   */
  static getInstance(argsObj) {
    return new Grid(argsObj);
  }

  /**
   * Class initializer
   *
   * @param object
   * @param callback
   * @return void
   */
  constructor(argsObj) {
    this.currentComponent = argsObj.currentComponent;
    this.initialState = this.currentComponent.initialState();
    this.url = argsObj.url; // Current action URL
    this.action = argsObj.action || getGridRecords; // Current action method
    this.actionType = argsObj.actionType; // Action type
    this.extraParams = argsObj.extraParams;
    this.currentPage = parseInt(argsObj.currentPage, 10) || 1; // Current page number
    this.defaultCurrentPage = this.currentPage;
    this.requestPath = argsObj.requestPath ? argsObj.requestPath : "/admin/";
    this.rowsPerPage = 10; // Records per page
    this.rowsPerPageOptions = {
      5: 5,
      10: 10,
      25: 25,
      50: 50,
      100: 100
    };
    this.sortByFieldName = ""; // Table head column sort by field name
    this.sortType = ""; // Default sort type -1 (-1 - DESC, 1 - ASC)
    this.selectedRow = [];
    this.selectedRowPerPage = 0;
    this.service = argsObj.service ? argsObj.service : 'digisense';
  }

  /**
   * build the query
   *
   * @return object
   */
  getQueryParams() {
    const extraParams = this.extraParams || {};
    const filters =
      this.currentComponent.state &&
      typeof this.currentComponent.state.filters === "object" ?
      this.currentComponent.state.filters : {};

    const params = Object.assign({}, extraParams, {
      sortAttribute: this.sortByFieldName || null,
      // sort: this.sortType || "DESC",
      pageNo: this.currentPage,
      limit: this.rowsPerPage,
      filters: []
    });

    const validFilters = this.formatFilters(filters);
    // uncomment after implementing API
    // params["filters"] = JSON.stringify({ ...validFilters
    // });
    return params;
  }

  /**
   * Join the nested objects by using dots
   *
   * @param object filters
   * @param string filterKey
   */
  formatFilters(filters, filterKey = "") {
    const self = this;
    let validFilters = {};
    Object.keys(filters).forEach(filter => {
      const filterName = !_.isEmpty(filterKey) ?
        `${filterKey}.${filter}` :
        filter;
      if (_.isObject(filters[filter])) {
        const subValidFilters = self.formatFilters(filters[filter], filterName);
        validFilters = _.merge(validFilters, subValidFilters);
        return;
      }
      const filterVal = filters[filter].toString().trim();
      if (!_.isEmpty(filterVal)) {
        validFilters[filterName] = filterVal;
      }
    });
    return validFilters;
  }

  /**
   * Update the header filter state value
   */
  updateColFiltersState = (name, value, dropdown = false) => {
    let filters = JSON.parse(
      JSON.stringify(this.currentComponent.state.filters)
    );
    filters = _.set(filters, name, value);
    // set state and call API if input is dropdown
    this.currentComponent.setState({
        filters
      },
      () => {
        dropdown && this.handleFilter();
      }
    );
  };

  /**
   * Handle grid column filter text change
   */
  handleColFiltersChange = e => {
    this.updateColFiltersState(e.target.name, e.target.value);
  };

  /**
   * Handle grid column filter keyDown
   */
  handleColFiltersKeyDown = e => {
    // Call table header filter when user press 'Enter key'
    if (e.keyCode === 13 || e.which === 13) {
      this.handleFilter();
    }
  };

  /**
   * Handle grid column filter select input change
   */
  handleColFiltersSelectChange = e => {
    this.updateColFiltersState(e.target.name, e.target.value, true);
  };

  /**
   * Handle grid column filter change
   */
  handleColSorting = (columnName, e) => {
    if (this.sortByFieldName !== columnName) {
      this.sortByFieldName = columnName;
      this.sortType = "DESC";
    } else {
      this.sortType = this.sortType == "ASC" ? "DESC" : "ASC"; // (-1 - DESC, 1 - ASC)
    }

    this.getRecords();
  };

  /**
   * Handle grid global search change
   */
  handleGlobalFiltersChange = e => {
    // This Comment code required in future
    this.currentComponent.setState({
      search: e.target.value
    });
  };

  /**
   * Handle grid column filter change
   */
  handleDateFiltersChange = (name, datetime) => {
    /**
     * Declare the handle Select Change
     */
    const filters = Object.assign({}, this.currentComponent.state.filters);
    filters[name] = new Date(datetime).valueOf();
    this.currentComponent.setState({
      filters
    });
    this.getRecords();
  };

  /**
   * Declare the handle Select Change
   */
  handleSelectChange(selected, value) {
    const selectedDom = ReactDOM.findDOMNode(selected);
    const name = selectedDom.getAttribute("data-name") ?
      selectedDom.getAttribute("data-name") :
      selectedDom.getAttribute("name");
    const filters = Object.assign({}, this.currentComponent.state.filters);
    filters[name] = value;
    this.currentComponent.setState({
      filters: filters,
      search: value
    });
  }

  /**
   * Handle the pagination click
   */
  handlePaginateClick = (page, pageRows) => {
    pageRows = pageRows || this.rowsPerPage;
    this.currentPage = page;
    if (this.rowsPerPage !== pageRows) {
      this.resetPagination();
    }
    this.rowsPerPage = parseInt(pageRows, 10);
    this.getRecords();
  };

  /**
   * Handle the No Of Entries change
   */
  handleNumberEntryChange = (page, pageRows) => {
    this.handlePaginateClick(page, pageRows);
  };

  /**
   * Set additional parameters into queryparams
   */
  setExtraParams(extraParams) {
    this.extraParams =
      extraParams && typeof extraParams === "object" ?
      Object.assign({}, this.extraParams, extraParams) :
      null;
  }

  /**
   * Get the records for table
   */
  getRecords(extraParams) {
    if (extraParams) {
      this.setExtraParams(extraParams);
    }
    return this.currentComponent.props.dispatch(
      this.action({
        url: this.url,
        actionType: this.actionType,
        queryParams: this.getQueryParams(),
        requestPath: this.requestPath,
        service: this.service
      })
    );
  }

  /**
   * Handle the delete funtionality
   */
  deleteRecord(deleteModalObj) {
    if (typeof deleteModalObj !== "object") {
      // This is the error statement to the developers
      console.error('The "Delete Record" method arguments must be an object.');
      return;
    }

    const action = deleteModalObj.action || deleteGridRecord;
    return this.currentComponent.props.dispatch(action(deleteModalObj));
  }

  /**
   * Handle the column based filter
   */
  handleFilter() {
    this.resetPagination();
    this.getRecords();
  }

  /**
   * Handle the column based filter reset
   */
  handleResetFilter() {
    this.resetPagination();
    this.currentComponent.setState({
        filters: this.initialState.filters,
        search: this.initialState.search
      },
      () => this.handleFilter()
    );
  }

  /**
   * Reset the pagination
   */
  resetPagination = () => {
    this.currentPage = this.defaultCurrentPage;
    this.rowsPerPage = 10;
  };

  /**
   * When user bulk delete the all the of the current page,
   * then currentPage is more than 0, need to reset the page to one level back
   * So it will fetch the previous page record.
   * Suppose if we do not reset to one page back, then it will show the 'No record exist' message on current page
   *
   */
  getRecordsAfterDelete() {
    if (this.selectedRow.length > 0) {
      this.currentPage =
        this.currentPage > 0 ? this.currentPage - 1 : this.currentPage;
    }
    this.getRecords();
  }

  /**
   * Function is check object / return new object
   *
   * @return void
   */
  isObjectOrReturnNewObject(obj) {
    return _.isObject(obj) ? obj : {};
  }

  /**
   * Function is check object / return new object
   *
   * @return void
   */
  getGridDataArray(obj) {
    return _.isObject(obj) ? (_.isArray(obj.data) ? obj.data : []) : {};
  }

  /**
   * Function is get the serialNo list
   * @return number
   *
   */
  getSerialNumber() {
    return (this.currentPage - 1) * this.rowsPerPage + 1;
  }
}

export default Grid;