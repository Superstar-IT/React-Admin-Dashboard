import React from 'react'
import { Helmet } from 'react-helmet'
import { Table, Button, Input, Icon } from 'antd';
import ReactExport from "react-data-export";
import { Link } from 'react-router-dom';
import { post } from '../../services/net'
import styles from './style.module.scss';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class athenaFleetsList extends React.Component {

  state = {
    items: [],
    pageSize: 100,
    sortBy: {id:"_id", desc: true},
    filterDropdownVisible1: '',
    filterDropdownVisible2: '',
    filterDropdownVisible3: '',
    filterDropdownVisible4: '',
    filterDropdownVisible5: '',
    filtered: '',
    pagination: {pageSizeOptions: ['10', '50', '100', '200'], showSizeChanger: true },
    search: [],
    searchableColumns: ['license', 'model_year', 'vehicle_vin_number', 'name', 'agent_name'],
  };

  componentDidMount() {
    this.getFleetsList();
  }

  onInputChange = (e, id) => {
    const {search} = this.state;
    search[id] = e.target.value;
    this.setState({search});
  };

  handleSearch = () => {
    this.getFleetsList();
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { pagination:pager } = this.state;
    let { sortBy } = this.state;
    // const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    if (sorter.columnKey !== undefined) {
      sortBy = {
        id: sorter.columnKey,
        desc: sorter.order !== 'ascend'
      };
    } else {
      sortBy = {id:"_id", desc: true}
    }

    this.setState({
      sortBy
    }, () => this.getFleetsList());

    console.log('sortBy', sortBy);

    console.log('sorter', sorter);
    console.log('filters', filters);
    console.log('pagination', pagination);
    console.log('pager', pager);
  }

  getFleetsList = (page) => {
    const { pageSize, sortBy, search, searchableColumns } = this.state;

    console.log('page', page);

    const filtered = [];

    searchableColumns.map((item) => {
      if (search[item]) {
        filtered.push({
          id: item,
          value: search[item]
        });
      }
      return 1;
    });

    const parameters = {
      filtered,
      pageSize,
      sortBy
    };
    console.log('params', parameters);
    const url = `${process.env.REACT_APP_API_URL}athenaFleetsList?page=0`;
    post(url, parameters).then(json => {
      console.log('json', json);
      if (json.success) {
        this.setState({
          items: Array.from(json.data.fleets),
        })
      }
      if (!json.success) {
        console.log('fail');
      }
    })
      .catch(err => {
        console.log('err', err);
      });
  };

  // expandedRowRender = (rides) => {
  //   const expandedRowRenderColumns = [
  //     {title: 'Ride Id', dataIndex: 'ride_id', key: 'ride_id'},
  //     {title: 'Ride Status', dataIndex: 'ride_status', key: 'ride_status'},
  //   ];
  //   const subTable = Array.from(rides);
  //   console.log('subTable', subTable);
  //   console.log('subTable', this.items);
  //
  //   const data = [];
  //   for (let i = 0; i < 3; i+=1) {
  //     data.push({
  //       ride_id: 1,
  //       ride_status: 'Completed',
  //     });
  //   }
  //
  //   console.log('data', data);
  //
  //   return (
  //     <Table
  //       columns={expandedRowRenderColumns}
  //       dataSource={data}
  //       pagination={false}
  //     />
  //   );
  // }

  resetFilters = () => {
    console.log('resetfilters');
    this.setState({search: []}, () => this.getFleetsList());
  };

  render() {
    const {
      items,
      filterDropdownVisible1,
      filterDropdownVisible2,
      filterDropdownVisible3,
      filterDropdownVisible4,
      filterDropdownVisible5,
      filtered,
      pagination,
      search,
    } = this.state;

    const expandedRowRender = (rides) => {
      const expandedRowRenderColumns = [
        {title: 'Ride Id', dataIndex: 'ride_id', key: 'ride_id'},
        {title: 'Booking Date', dataIndex: 'booking_date', key: 'booking_date'},
        {title: 'Pickup Date', dataIndex: 'pickup_date', key: 'pickup_date'},
        {title: 'Drop Date', dataIndex: 'drop_date', key: 'drop_date'},
        {title: 'Total' , render: (row) => <div>{Number(row.total.paid_amount - row.total.booking_fee - row.total.service_fee - row.total.service_tax - row.total.accessFee + row.total.cancellation_fee).toFixed(2)}</div>}
      ];
      return (
        <Table
          rowKey={(record) => record.ride_id}
          columns={expandedRowRenderColumns}
          dataSource={rides}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: 'Number',
        dataIndex: 'license',
        key: 'license',
        render: (license) => <div>{license}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['license']}
              onChange={(e) => this.onInputChange(e, 'license')}
              onPressEnter={this.handleSearch}
            />
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible1,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible1: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Type',
        render: (row) => <div>{row.license.length === 4 ? 'Medallion' : row.license.length === 5 ? 'SHL' : 'N/A'}</div>,
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Vehicle',
        dataIndex: 'vehicle_model',
        key: 'vehicle_model',
        render: (vehicleModel) => <div>{vehicleModel}</div>,
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Vehicle',
        dataIndex: 'vehicle_vin_number',
        key: 'vehicle_vin_number',
        render: (vehicleVinNumber) => <div>{vehicleVinNumber}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['vehicle_vin_number']}
              onChange={(e) => this.onInputChange(e, 'vehicle_vin_number')}
              onPressEnter={this.handleSearch}
            />
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible2,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible2: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Veh Type',
        dataIndex: 'vehicle_type',
        key: 'vehicle_type',
        render: (vehicleType) => <div>{vehicleType}</div>,
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Model Year',
        dataIndex: 'model_year',
        key: 'model_year',
        render: (modelYear) => <div>{modelYear}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['model_year']}
              onChange={(e) => this.onInputChange(e, 'model_year')}
              onPressEnter={this.handleSearch}
            />
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible3,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible3: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Owner',
        dataIndex: 'name',
        key: 'name',
        render: (name, row) => <div>{row.agent_name === undefined && <Link to="">{ row.name }</Link>} { row.agent_name !== undefined && row.name}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['name']}
              onChange={(e) => this.onInputChange(e, 'name')}
              onPressEnter={this.handleSearch}
            />
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible4,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible4: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Agent',
        dataIndex: 'agent_name',
        key: 'agent_name',
        render: (agentName) => <div>{agentName}</div>,
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={this.refSearchInput}
              placeholder="Search name"
              value={search['agent_name']}
              onChange={(e) => this.onInputChange(e, 'agent_name')}
              onPressEnter={this.handleSearch}
            />
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible5,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible5: visible,
            },
            () => this.searchInput && this.searchInput.focus(),
          )
        },
      },
      {
        title: 'Compl trips',
        dataIndex: 'count',
        key: 'count',
        render: (count) => <div>{count}</div>,
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Can trips',
        dataIndex: 'count_cancelled',
        key: 'count_cancelled',
        render: (countCancelled) => <div>{countCancelled}</div>,
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (amount) => <div>{amount.toFixed(2)}</div>,
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Action',
        dataIndex: '_id',
        render: (id) => <div><Link to={`/fleets/viewFleet/${id}`}><Button icon="eye" className="mr-1" size="small" /></Link></div>,
      },
    ];


    return (
      <div>
        <Helmet title="Athena Fleets list" />
        <div className="row">
          <div className="col-12">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.utils__title}>
                  <strong><span className="fa fa-edit" /> Athena Fleets list</strong>
                </div>
                <div className={styles.cardBody}>
                  <div className="row">
                    <div className="col-12">
                      <div className="float-left">
                        <Button icon="filter" onClick={() => this.resetFilters()}>Reset Filters</Button>
                      </div>
                      <div className="float-right">
                        <ExcelFile element={<Button icon="download" type="primary">Download</Button>}>
                          <ExcelSheet data={items} name="Fleets">
                            <ExcelColumn label="License" value="license" />
                            <ExcelColumn label="Type" value={(col) => col.license.length === 4 ? 'Medallion' : col.license.length === 5 ? 'SHL' : 'N/A'} />
                            <ExcelColumn label="Vehicle" value={(col) => col.driver.vehicle_model} />
                            <ExcelColumn label="VIN" value="vehicle_vin_number" />
                            <ExcelColumn label="Vehicle Type" value="vehicle_type" />
                            <ExcelColumn label="Model Year" value="model_year" />
                            <ExcelColumn label="Owner" value="name" />
                            <ExcelColumn label="Agent" value="agent_name" />
                            <ExcelColumn label="Number of trips" value="count" />
                          </ExcelSheet>
                        </ExcelFile>
                      </div>
                    </div>
                  </div>
                  <div className={styles.marginTop10}>
                    <Table
                      className="utils__scrollTable"
                      rowKey={record => record._id}
                      columns={columns}
                      dataSource={items}
                      expandedRowRender={(rowIndex) => expandedRowRender(rowIndex.rides)}
                      pagination={pagination}
                      onChange={this.handleTableChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default athenaFleetsList
