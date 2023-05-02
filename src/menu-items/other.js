// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandChrome, IconHelp, IconSitemap } from '@tabler/icons';

// constant
const icons = {
    IconBrandChrome,
    IconHelp,
    IconSitemap
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    title: <FormattedMessage id="menu" />,
    icon: icons.IconHelp,
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: <FormattedMessage id="dashboard" />,
            type: 'item',
            url: '/dashboard',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        },
        {
            id: 'invoice',
            title: <FormattedMessage id="invoice" />,
            type: 'item',
            url: '/invoices',
            icon: icons.IconHelp,
            external: true,
            target: true
        },
        {
            id: 'master',
            title: <FormattedMessage id="master" />,
            type: 'item',
            url: '/master',
            icon: icons.IconSitemap,
            external: true,
            target: true
        }
    ]
};

export default other;
