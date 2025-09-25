import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Project {
    id: number;
    contract_id: string;
    project_name: string | null;
    status: string | null;
    region?: {
        name: string;
    };
}

interface Change {
    id: number;
    contract_id: string;
    change_type: string;
    detected_at: string;
    infrastructure_project?: {
        project_name: string;
    };
}

interface DashboardProps {
    stats: {
        total_projects: number;
        active_projects: number;
        completed_projects: number;
        total_regions: number;
        total_changes: number;
        recent_changes: number;
    };
    recentProjects: Project[];
    recentChanges: Change[];
    regionStats: Array<{
        name: string;
        count: number;
    }>;
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
        scale: 0.95
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

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
    hover: {
        scale: 1.01,
        y: -1,
        transition: {
            duration: 0.2,
            ease: "easeOut" as const,
        },
    },
};

const numberCountVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "backOut" as const,
        },
    },
};

export default function Dashboard({ stats, recentProjects, recentChanges, regionStats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <motion.div
                className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Stats Cards */}
                <motion.div
                    className="grid auto-rows-min gap-6 md:grid-cols-3"
                    variants={itemVariants}
                >
                    <motion.div
                        className="group relative overflow-hidden rounded-2xl border border-sidebar-border/50 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm dark:border-sidebar-border dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-sm"
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Projects</p>
                                <motion.p
                                    className="text-4xl font-bold text-blue-900 dark:text-blue-100"
                                    variants={numberCountVariants}
                                >
                                    {stats.total_projects.toLocaleString()}
                                </motion.p>
                            </div>
                            <motion.div
                                className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50"
                                whileHover={{ scale: 1.05, rotate: 3 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="h-6 w-6 rounded-full bg-blue-500 shadow-lg" />
                            </motion.div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-xl" />
                    </motion.div>

                    <motion.div
                        className="group relative overflow-hidden rounded-2xl border border-sidebar-border/50 bg-gradient-to-br from-emerald-50 to-green-50 p-8 shadow-sm dark:border-sidebar-border dark:from-emerald-950/50 dark:to-green-950/50 backdrop-blur-sm"
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Active Projects</p>
                                <motion.p
                                    className="text-4xl font-bold text-emerald-900 dark:text-emerald-100"
                                    variants={numberCountVariants}
                                >
                                    {stats.active_projects.toLocaleString()}
                                </motion.p>
                            </div>
                            <motion.div
                                className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50"
                                whileHover={{ scale: 1.05, rotate: -3 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="h-6 w-6 rounded-full bg-emerald-500 shadow-lg" />
                            </motion.div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-400/20 blur-xl" />
                    </motion.div>

                    <motion.div
                        className="group relative overflow-hidden rounded-2xl border border-sidebar-border/50 bg-gradient-to-br from-orange-50 to-amber-50 p-8 shadow-sm dark:border-sidebar-border dark:from-orange-950/50 dark:to-amber-950/50 backdrop-blur-sm"
                        variants={cardVariants}
                        whileHover="hover"
                        layout
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Recent Changes</p>
                                <motion.p
                                    className="text-4xl font-bold text-orange-900 dark:text-orange-100"
                                    variants={numberCountVariants}
                                >
                                    {stats.recent_changes.toLocaleString()}
                                </motion.p>
                            </div>
                            <motion.div
                                className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="h-6 w-6 rounded-full bg-orange-500 shadow-lg" />
                            </motion.div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-orange-400/20 to-amber-400/20 blur-xl" />
                    </motion.div>
                </motion.div>

                {/* Main Content */}
                <div
                    className="grid gap-6 lg:grid-cols-2"
                >
                    {/* Recent Projects */}
                    <div
                        className="group relative overflow-hidden rounded-2xl border border-sidebar-border/50 bg-card/50 dark:border-sidebar-border backdrop-blur-sm shadow-sm"
                    >
                        <div className="absolute inset-0" />
                        <div className="relative p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">Recent Projects</h3>
                                    <p className="text-sm text-muted-foreground">Latest infrastructure projects</p>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/projects"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900/50"
                                    >
                                        View all
                                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            </div>
                            <div className="space-y-4">
                                {recentProjects.slice(0, 5).map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        className="group/item flex items-start justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 rounded-xl transition-all duration-300 border border-border/50"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.1 + index * 0.1,
                                            duration: 0.5,
                                            ease: "easeOut"
                                        }}
                                        whileHover={{ scale: 1.01, x: 2 }}
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground group-hover/item:text-blue-600 transition-colors duration-200 font-mono">
                                                {project.contract_id}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{project.project_name || 'Unnamed Project'}</p>
                                            <p className="text-sm text-muted-foreground">{project.region?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <motion.span
                                                className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' :
                                                    project.status === 'On-Going' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                {project.status || 'Unknown'}
                                            </motion.span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Changes */}
                    <div
                        className="group relative overflow-hidden rounded-2xl border border-sidebar-border/50 bg-card/50 dark:border-sidebar-border backdrop-blur-sm shadow-sm"
                    >
                        <div className="absolute inset-0" />
                        <div className="relative p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground mb-1">Recent Changes</h3>
                                    <p className="text-sm text-muted-foreground">Latest project updates</p>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/changes"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 dark:bg-purple-950/50 dark:text-purple-400 dark:hover:bg-purple-900/50"
                                    >
                                        View all
                                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </motion.div>
                            </div>
                            <div className="space-y-4">
                                {recentChanges.slice(0, 5).map((change, index) => (
                                    <motion.div
                                        key={change.id}
                                        className="group/item flex items-start justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 rounded-xl transition-all duration-300 border border-border/50"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.1 + index * 0.1,
                                            duration: 0.5,
                                            ease: "easeOut"
                                        }}
                                        whileHover={{ scale: 1.01, x: -2 }}
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground group-hover/item:text-purple-600 transition-colors duration-200 font-mono">
                                                {change.contract_id}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {change.infrastructure_project?.project_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(change.detected_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <motion.span
                                                className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full ${change.change_type === 'created' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' :
                                                    change.change_type === 'updated' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200' :
                                                        change.change_type === 'deleted' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200' :
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                {change.change_type}
                                            </motion.span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Region Stats */}
                <div
                    className="group relative overflow-hidden rounded-2xl border border-sidebar-border/50 bg-card/50 dark:border-sidebar-border backdrop-blur-sm shadow-sm"
                >
                    <div className="absolute inset-0" />
                    <div className="relative p-8">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-foreground mb-1">Projects by Region</h3>
                            <p className="text-sm text-muted-foreground">Distribution across different regions</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {regionStats.map((region, index) => (
                                <motion.div
                                    key={region.name}
                                    className="group/region flex items-center justify-between p-6 bg-gradient-to-r from-muted/30 to-muted/10 hover:from-indigo-50 hover:to-cyan-50 dark:hover:from-indigo-950/30 dark:hover:to-cyan-950/30 rounded-2xl border border-border/50 hover:border-indigo-200/50 dark:hover:border-indigo-800/50 transition-all duration-300"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 0.1 + index * 0.05,
                                        duration: 0.4,
                                        ease: "easeOut"
                                    }}
                                    whileHover={{ scale: 1.02, y: -1 }}
                                >
                                    <span className="font-semibold text-foreground group-hover/region:text-indigo-700 dark:group-hover/region:text-indigo-300 transition-colors duration-200">
                                        {region.name}
                                    </span>
                                    <motion.span
                                        className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: 0.2 + index * 0.05,
                                            duration: 0.6,
                                            ease: "backOut"
                                        }}
                                    >
                                        {region.count.toLocaleString()}
                                    </motion.span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
