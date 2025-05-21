import Detail from './Detail';
import History from './History';
import Search from './Search'

const OutputVoucher = [
    {
        path : '/OutputVoucher',
        component : Search
    },
    {
        path : '/History',
        component : History
    },
    {
        path : '/OutputVoucher/Detail/:outputvoucherid',
        component : Detail
    },
]
export default OutputVoucher;