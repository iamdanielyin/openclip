import dva from 'dva';
import createLoading from 'dva-loading';
import './utils/socket';
import './index.less';

// 1. Initialize
const app = dva();

// 2. Plugin
app.use(createLoading());

// 3. Model
app.model(require('./models/index').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
