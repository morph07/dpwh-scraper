import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

interface Project {
    id: number;
    contract_id: string;
    project_name: string;
    contractor: string | null;
    status: string | null;
    contract_amount: string | null;
    physical_progress: string | null;
    region: {
        name: string;
    };
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProjectsIndexProps {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    regions: Array<{
        id: number;
        name: string;
    }>;
    statuses: string[];
    filters: {
        region?: string;
        status?: string;
        search?: string;
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

export default function ProjectsIndex({ projects: projectsData, regions, statuses, filters }: ProjectsIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRegion, setSelectedRegion] = useState(filters.region || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get('/projects', {
            search: searchTerm,
            region: selectedRegion,
            status: selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedRegion('');
        setSelectedStatus('');
        router.get('/projects', {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Infrastructure Projects" />
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">Infrastructure Projects</h1>
                        <p className="text-muted-foreground">Monitor and track DPWH infrastructure projects</p>
                    </div>
                    <motion.div
                        className="text-right"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {projectsData.total.toLocaleString()}
                            </div>
                            <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                                total projects
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Filters */}
                <div
                    className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-sidebar-border/50 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">Search</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search projects..."
                                className="w-full px-4 py-3 border border-input/50 rounded-xl text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">Region</label>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="w-full px-4 py-3 border border-input/50 rounded-xl text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                            >
                                <option value="">All Regions</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                        {region.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-3 border border-input/50 rounded-xl text-sm bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
                            >
                                <option value="">All Statuses</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-3">
                            <button
                                onClick={handleFilter}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25"
                            >
                                Filter
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-3 border border-input/50 rounded-xl text-sm font-semibold hover:bg-muted/50 transition-all duration-200"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                <div
                    className="bg-card/50 backdrop-blur-sm rounded-2xl border border-sidebar-border/50 overflow-hidden shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contract ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Project Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Region</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contractor</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Progress</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {projectsData.data.map((project, index) => (
                                    <tr
                                        key={project.id}
                                        className="group hover:bg-muted/30 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <Link
                                                    href={`/projects/${project.id}`}
                                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 font-mono"
                                                >
                                                    {project.contract_id}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-md">
                                            <div className="truncate font-medium text-foreground group-hover:text-blue-600 transition-colors duration-200" title={project.project_name}>
                                                {project.project_name || 'Unnamed Project'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-nowrap">
                                                {project.region.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="truncate text-sm text-muted-foreground" title={project.contractor || ''}>
                                                {project.contractor || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-nowrap ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' :
                                                    project.status === 'On-Going' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                    }`}
                                            >
                                                {project.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {project.physical_progress ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-muted-foreground min-w-12">
                                                        {project.physical_progress}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {project.contract_amount ? (
                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                    ₱{parseFloat(project.contract_amount).toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {projectsData.last_page > 1 && (
                        <motion.div
                            className="px-6 py-4 border-t border-border/30 bg-gradient-to-r from-muted/20 to-muted/10"
                            variants={itemVariants}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-semibold">{((projectsData.current_page - 1) * projectsData.per_page) + 1}</span> to <span className="font-semibold">{Math.min(projectsData.current_page * projectsData.per_page, projectsData.total)}</span> of <span className="font-semibold">{projectsData.total}</span> results
                                </div>
                                <div className="flex items-center gap-2">
                                    {projectsData.links.map((link, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => link.url && router.visit(link.url)}
                                            disabled={!link.url}
                                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${link.active
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                                : link.url
                                                    ? 'border border-input/50 hover:bg-muted/50 text-foreground hover:scale-105'
                                                    : 'text-muted-foreground cursor-not-allowed opacity-50'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            whileHover={link.url ? { scale: 1.02 } : {}}
                                            whileTap={link.url ? { scale: 0.98 } : {}}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AppLayout>
    );
}
