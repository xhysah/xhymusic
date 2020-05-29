import '../css/theme/index.css'
import Vue from 'vue'
import {
  Form,
  FormItem,
  Input,
  Card,
  Button,
  Row,
  Message,
  Carousel,
  CarouselItem,
  Link,
  Image,
  Pagination,
  Menu,
  MenuItem,
  Container,
  Aside,
  Main,
  Table,
  TableColumn,
  Dialog,
  Col,
  Divider,
  Tabs,
  TabPane,
  Popover,
  Progress,
  Collapse,
  CollapseItem,
  MessageBox
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Card)
Vue.use(Button)
Vue.use(Row)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Link)
Vue.use(Image)
Vue.use(Pagination)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Col)
Vue.use(Divider)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Popover)
Vue.use(Progress)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
