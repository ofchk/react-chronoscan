// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconLayoutDashboard, IconFileInvoice, IconDatabase, IconKey, IconBug, IconList, IconFilePlus } from '@tabler/icons';

// constant
const icons = { IconBug, IconKey };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const other = {
    id: 'menu',
    title: <FormattedMessage id="menu" />,    
    icon: icons.IconKey,
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: <FormattedMessage id="dashboard" />,
            type: 'item',
            url: '/dashboard',
            icon: IconLayoutDashboard,
            breadcrumbs: false
        },{
            id: 'invoice',
            title: <FormattedMessage id="invoice" />,
            type: 'item',
            url: '/invoice/list',
            icon: IconFileInvoice,
            breadcrumbs: false
        }
    ]
};

export default other;
