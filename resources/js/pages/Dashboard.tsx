import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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

export default function Dashboard({ stats, recentProjects, recentChanges, regionStats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                                <p className="text-3xl font-bold">{stats.total_projects.toLocaleString()}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                                <p className="text-3xl font-bold">{stats.active_projects.toLocaleString()}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Recent Changes</p>
                                <p className="text-3xl font-bold">{stats.recent_changes.toLocaleString()}</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Projects */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Recent Projects</h3>
                                <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-800">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentProjects.slice(0, 5).map((project) => (
                                    <div key={project.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{project.project_name || 'Unnamed Project'}</p>
                                            <p className="text-xs text-muted-foreground">{project.contract_id}</p>
                                            <p className="text-xs text-muted-foreground">{project.region?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                project.status === 'On-Going' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {project.status || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Changes */}
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Recent Changes</h3>
                                <Link href="/changes" className="text-sm text-blue-600 hover:text-blue-800">
                                    View all
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentChanges.slice(0, 5).map((change) => (
                                    <div key={change.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{change.contract_id}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {change.infrastructure_project?.project_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(change.detected_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${change.change_type === 'created' ? 'bg-green-100 text-green-800' :
                                                change.change_type === 'updated' ? 'bg-yellow-100 text-yellow-800' :
                                                    change.change_type === 'deleted' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {change.change_type}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Region Stats */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Projects by Region</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            {regionStats.map((region) => (
                                <div key={region.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                    <span className="font-medium">{region.name}</span>
                                    <span className="text-2xl font-bold text-blue-600">{region.count.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
