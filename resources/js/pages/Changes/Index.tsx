import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
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

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

const tableRowVariants = {
    hidden: {
        opacity: 0,
        x: -10
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut" as const,
        },
    },
    hover: {
        scale: 1.005,
        backgroundColor: "rgba(0, 0, 0, 0.01)",
        transition: {
            duration: 0.2,
        },
    },
};

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
            <motion.div
                className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between"
                    variants={itemVariants}
                >
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Project Changes</h1>
                        <p className="text-muted-foreground">Track all modifications and updates to infrastructure projects</p>
                    </div>
                    <motion.div
                        className="text-right"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="px-4 py-2 bg-purple-50 dark:bg-purple-950/50 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {changesData.total.toLocaleString()}
                            </div>
                            <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
                                total changes tracked
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-sidebar-border/50 shadow-sm"
                    variants={itemVariants}
                >
                    <div className="grid gap-4 md:grid-cols-5">
                        <motion.div
                        >
                            <label className="block text-sm font-semibold mb-2 text-foreground">Change Type</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-3 border border-input/50 rounded-xl text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200"
                            >
                                <option value="">All Types</option>
                                {changeTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </motion.div>
                        <motion.div
                        >
                            <label className="block text-sm font-semibold mb-2 text-foreground">Contract ID</label>
                            <input
                                type="text"
                                value={contractId}
                                onChange={(e) => setContractId(e.target.value)}
                                placeholder="Contract ID..."
                                className="w-full px-4 py-3 border border-input/50 rounded-xl text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200"
                            />
                        </motion.div>
                        <motion.div
                        >
                            <label className="block text-sm font-semibold mb-2 text-foreground">Date From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-4 py-3 border border-input/50 rounded-xl text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200"
                            />
                        </motion.div>
                        <motion.div
                        >
                            <label className="block text-sm font-semibold mb-2 text-foreground">Date To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-4 py-3 border border-input/50 rounded-xl text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all duration-200"
                            />
                        </motion.div>
                        <div className="flex items-end gap-3">
                            <motion.button
                                onClick={handleFilter}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-500/25"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Filter
                            </motion.button>
                            <motion.button
                                onClick={clearFilters}
                                className="px-4 py-3 border border-input/50 rounded-xl text-sm font-semibold hover:bg-muted/50 transition-all duration-200"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Clear
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Changes Table */}
                <motion.div
                    className="bg-card/50 backdrop-blur-sm rounded-2xl border border-sidebar-border/50 overflow-hidden shadow-sm"
                    variants={itemVariants}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Project</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Change Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Field Changed</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Old Value</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">New Value</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {changesData.data.map((change, index) => (
                                    <motion.tr
                                        key={change.id}
                                        className="group hover:bg-muted/30 transition-colors duration-200"
                                        variants={tableRowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        transition={{ delay: index * 0.02 }}
                                        whileHover="hover"
                                    >
                                        <td className="px-6 py-4 text-sm">
                                            <div className="space-y-1">
                                                <div className="font-medium text-foreground">
                                                    {new Date(change.detected_at).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(change.detected_at).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Link
                                                        href={`/projects/${change.infrastructure_project.id}`}
                                                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 font-mono"
                                                    >
                                                        {change.infrastructure_project.contract_id}
                                                    </Link>
                                                </motion.div>
                                                <div className="text-xs text-muted-foreground">
                                                    {change.infrastructure_project.region.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <motion.span
                                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {change.change_type}
                                            </motion.span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <motion.span
                                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {change.field_name}
                                            </motion.span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="truncate text-sm text-muted-foreground bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-lg" title={change.old_value || ''}>
                                                {change.old_value || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="truncate text-sm font-medium bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-lg text-green-700 dark:text-green-300" title={change.new_value || ''}>
                                                {change.new_value || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Link
                                                    href={`/changes/${change.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 dark:bg-purple-950/50 dark:text-purple-400 dark:hover:bg-purple-900/50"
                                                >
                                                    View Details
                                                    <svg className="ml-2 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </motion.div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {changesData.last_page > 1 && (
                        <motion.div
                            className="px-6 py-4 border-t border-border/30 bg-gradient-to-r from-muted/20 to-muted/10"
                            variants={itemVariants}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-semibold">{((changesData.current_page - 1) * changesData.per_page) + 1}</span> to <span className="font-semibold">{Math.min(changesData.current_page * changesData.per_page, changesData.total)}</span> of <span className="font-semibold">{changesData.total}</span> results
                                </div>
                                <div className="flex items-center gap-2">
                                    {changesData.links.map((link, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => link.url && router.visit(link.url)}
                                            disabled={!link.url}
                                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${link.active
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                                : link.url
                                                    ? 'border border-input/50 hover:bg-muted/50 text-foreground hover:scale-105'
                                                    : 'text-muted-foreground cursor-not-allowed opacity-50'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            whileHover={link.url ? { scale: 1.05, y: -1 } : {}}
                                            whileTap={link.url ? { scale: 0.98 } : {}}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </AppLayout>
    );
}
