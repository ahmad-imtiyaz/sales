import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    Building2,
    Users,
    Banknote,
    Package,
    Truck,
    FileText,
    FileBarChart,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import bankAccounts from '@/routes/bank-accounts';
import companies from '@/routes/companies';
import customers from '@/routes/customers';
import deliveryNotesRoutes from '@/routes/delivery-notes';
import documentation from '@/routes/documentation';
import invoicesRoutes from '@/routes/invoices';
import laporanRoutes from '@/routes/laporan';
import products from '@/routes/products';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Master Perusahaan',
        href: companies.index.url(),
        icon: Building2,
    },
    {
        title: 'Master Customer',
        href: customers.index.url(),
        icon: Users,
    },
    {
        title: 'Master Barang',
        href: products.index.url(),
        icon: Package,
    },
    {
        title: 'Master Rekening',
        href: bankAccounts.index.url(),
        icon: Banknote,
    },
    {
        title: 'Delivery Note',
        href: deliveryNotesRoutes.index.url(),
        icon: Truck,
    },
    {
        title: 'Invoice',
        href: invoicesRoutes.index.url(),
        icon: FileText,
    },
    {
        title: 'Laporan Delivery Note',
        href: laporanRoutes.deliveryNotes.url(),
        icon: FileBarChart,
    },
    {
        title: 'Laporan Invoice',
        href: laporanRoutes.invoices.url(),
        icon: FileBarChart,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/ahmad-imtiyaz/sales',
        icon: FolderGit2,
    },
    {
        title: 'Dokumentasi',
        href: documentation.index.url(),
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
