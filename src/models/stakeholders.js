const stakeholders = {
  state: {
    data: [
      {
        type: 'Organization',
        logo: './logo_192x192.png',
        name: 'Greenstand',
        id: '10193',
        map: '/greenstandMap',
        email: 'hello@greenstand.com',
        phone: '123-123-2122',
        website: 'greenstand.org',
        children: [
          {
            type: 'person',
            name: 'Child One',
            id: '22214',
            map: '/childOne',
            email: 'child@gmail.com',
            phone: '123-123-1234',
            website: 'childone.com',
          },
          {
            type: 'person',
            name: 'Child Two',
            id: '31234',
            map: '/childtwo',
            email: 'childtwo@gmail.com',
            phone: '123-234-1234',
            website: 'childtwo.com',
          },
        ],
        parents: [
          {
            type: 'person',
            name: 'Parent One',
            id: '10123',
            map: '/parentone',
            email: 'parent@gmail.com',
            phone: '123-123-1234',
            website: 'parentone.com',
          },
        ],
        users: [
          {
            id: '1234',
            username: 'admin1',
            fullName: 'Admin One',
            roles: 'admin',
          },
          {
            id: '1235',
            username: 'admin2',
            fullName: 'Admin Two',
            roles: 'admin',
          },
        ],
        growers: [
          { fullName: 'Grower One', id: '12345', createdAt: '01/02/2021' },
          { fullName: 'Grower Two', id: '12331', createdAt: '20/02/2021' },
          { fullName: 'Grower Three', id: '12316', createdAt: '01/02/2021' },
          { fullName: 'Grower Four', id: '12317', createdAt: '20/02/2021' },
          { fullName: 'Grower Five', id: '12329', createdAt: '01/02/2021' },
          { fullName: 'Grower Six', id: '12335', createdAt: '20/02/2021' },
          { fullName: 'Grower Seven', id: '12137', createdAt: '01/02/2021' },
          { fullName: 'Grower Eight', id: '12334', createdAt: '20/02/2021' },
          { fullName: 'Grower Nine', id: '12318', createdAt: '01/02/2021' },
          { fullName: 'Grower Ten', id: '12330', createdAt: '20/02/2021' },
        ],
      },
      {
        type: 'org',
        logo: './logo_192x192.png',
        name: 'Greenstance',
        id: '41341',
        map: '/greenstance',
        email: 'hello@greenstance.com',
        phone: '123-123-1234',
        website: 'greenstance.com',
        children: [],
        parents: [],
        users: [],
        growers: [],
      },
      {
        type: 'org',
        logo: './logo_192x192.png',
        name: 'Green Space',
        id: '51324',
        map: '/greenspace',
        email: 'greenspace@green.com',
        phone: '123-123-1324',
        website: 'greenspace.com',
        children: [],
        parents: [],
        users: [],
        growers: [],
      },
      {
        type: 'org',
        logo: './logo_192x192.png',
        name: 'Green World',
        id: '61234',
        map: '/greenworld',
        email: 'hi@greenworld.com',
        phone: '123-123-1234',
        website: 'greenworld.com',
        children: [],
        parents: [],
        users: [],
        growers: [],
      },
    ],
    display: [],
    columns: [
      { label: 'Name', value: 'name' },
      { label: 'ID', value: 'id' },
      { label: 'Map', value: 'map' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Website', value: 'website' },
    ],
    page: 0,
    rowsPerPage: 1,
    filters: {},
    sortBy: undefined,
    sortAsc: true,
  },
  reducers: {
    setData(state, data) {
      return { ...state, data };
    },
    setPage(state, page) {
      return { ...state, page };
    },
    setRowsPerPage(state, rowsPerPage) {
      return { ...state, rowsPerPage };
    },
    setSortAsc(state) {
      return { ...state, sortAsc: !state.sortAsc };
    },
    setSortBy(state, sortBy) {
      return { ...state, sortBy };
    },
    setFilters(state, payload) {
      return { ...state, filters: payload };
    },
    setDisplay(state) {
      let display;

      // sorting
      if (state.sortBy) {
        if (state.sortAsc) {
          display = state.data
            .slice()
            .sort((a, b) => (a[state.sortBy] > b[state.sortBy] ? -1 : 1));
        } else {
          display = state.data
            .slice()
            .sort((a, b) => (a[state.sortBy] > b[state.sortBy] ? 1 : -1));
        }
      } else {
        display = state.data;
      }

      // pagination
      display = display.slice(
        state.page * state.rowsPerPage,
        (state.page + 1) * state.rowsPerPage,
      );

      return {
        ...state,
        display,
      };
    },
  },
  effects: {
    changeRowsPerPage(payload) {
      this.setRowsPerPage(payload);
      this.setDisplay();
    },
    changePage(payload) {
      this.setPage(payload);
      this.setDisplay();
    },
    async getData() {
      // fetch api
      // set data
      this.setDisplay();
    },
    sort(payload) {
      this.setSortBy(payload);
      this.setSortAsc();
      this.setDisplay();
    },
    async updateFilters(payload) {
      this.setFilters(payload);
      // fetch api
      // set data
      // set display
    },
    async createStakeholder(payload) {
      console.log(payload);
      // send api request
    },
    async linkStakeholder(payload) {
      console.log('link');
      console.log({ type: payload.type, id: payload.id });
    },
    async unlinkStakeholder(payload) {
      console.log('unlink');
      console.log({ type: payload.type, id: payload.id });
    },
  },
};

export default stakeholders;
