import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Changes',
        href: '/changes',
    },
];

interface Change {
    id: number;
    field_name: string;
    old_value: string | null;
    new_value: string | null;
    detected_at: string;
    change_type: string;
    contract_id: string;
    infrastructure_project: {
        id: number;
        contract_id: string;
        project_name: string;
        region: {
            name: string;
        };
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ChangesIndexProps {
    changes: {
        data: Change[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    changeTypes: string[];
    filters: {
        type?: string;
        contract_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function ChangesIndex({ changes: changesData, changeTypes, filters }: ChangesIndexProps) {
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [contractId, setContractId] = useState(filters.contract_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        router.get('/changes', {
            type: selectedType,
            contract_id: contractId,
            date_from: dateFrom,
            date_to: dateTo,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSelectedType('');
        setContractId('');
        setDateFrom('');
        setDateTo('');
        router.get('/changes', {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Project Changes" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Project Changes</h1>
                    <div className="text-sm text-muted-foreground">
                        {changesData.total.toLocaleString()} total changes tracked
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-lg p-4 border border-sidebar-border/70">
                    <div className="grid gap-4 md:grid-cols-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">Change Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                            >
                                <option value="">All Types</option>
                                {changeTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contract ID</label>
                            <input
                                type="text"
                                value={contractId}
                                onChange={(e) => setContractId(e.target.value)}
                                placeholder="Contract ID..."
                                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Date To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleFilter}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                            >
                                Filter
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 border border-input rounded-md text-sm hover:bg-muted"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Changes Table */}
                <div className="bg-card rounded-lg border border-sidebar-border/70 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Project</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Change Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Field Changed</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Old Value</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">New Value</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {changesData.data.map((change) => (
                                    <tr key={change.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(change.detected_at).toLocaleDateString()} at{' '}
                                            {new Date(change.detected_at).toLocaleTimeString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <Link
                                                    href={`/projects/${change.infrastructure_project.id}`}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    {change.infrastructure_project.contract_id}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">
                                                    {change.infrastructure_project.region.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                                {change.change_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                                {change.field_name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <div className="truncate text-sm text-muted-foreground" title={change.old_value || ''}>
                                                {change.old_value || '-'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-w-xs">
                                            <div className="truncate text-sm font-medium" title={change.new_value || ''}>
                                                {change.new_value || '-'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/changes/${change.id}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {changesData.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-border">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((changesData.current_page - 1) * changesData.per_page) + 1} to {Math.min(changesData.current_page * changesData.per_page, changesData.total)} of {changesData.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    {changesData.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.visit(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1 text-sm rounded ${link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : link.url
                                                    ? 'border border-input hover:bg-muted'
                                                    : 'text-muted-foreground cursor-not-allowed'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
