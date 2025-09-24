import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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

interface ChangeShowProps {
    change: Change;
}

export default function ChangeShow({ change }: ChangeShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Changes',
            href: '/changes',
        },
        {
            title: `Change #${change.id}`,
            href: `/changes/${change.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Change #${change.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Change Details</h1>
                        <p className="text-muted-foreground">Change #${change.id}</p>
                    </div>
                    <Link
                        href="/changes"
                        className="px-4 py-2 border border-input rounded-md text-sm hover:bg-muted"
                    >
                        Back to Changes
                    </Link>
                </div>

                {/* Change Details Card */}
                <div className="bg-card rounded-lg border border-sidebar-border/70 p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Project
                                </label>
                                <div>
                                    <Link
                                        href={`/projects/${change.infrastructure_project.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-lg font-medium"
                                    >
                                        {change.infrastructure_project.contract_id}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">
                                        {change.infrastructure_project.project_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Region: {change.infrastructure_project.region.name}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Change Type
                                </label>
                                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                                    {change.change_type}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Field Changed
                                </label>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                                    {change.field_name}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Detection Date
                                </label>
                                <div>
                                    <p className="text-lg">
                                        {new Date(change.detected_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        at {new Date(change.detected_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Previous Value
                                </label>
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800">
                                        {change.old_value || '(No previous value)'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    New Value
                                </label>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-800">
                                        {change.new_value || '(Empty value)'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Summary */}
                <div className="bg-card rounded-lg border border-sidebar-border/70 p-6">
                    <h2 className="text-lg font-semibold mb-4">Change Summary</h2>
                    <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm">
                            On <strong>{new Date(change.detected_at).toLocaleDateString()}</strong> at{' '}
                            <strong>{new Date(change.detected_at).toLocaleTimeString()}</strong>,
                            the field <strong>"{change.field_name}"</strong> in project{' '}
                            <strong>{change.infrastructure_project.contract_id}</strong> was changed from:
                        </p>
                        <div className="mt-3 pl-4 border-l-2 border-red-300">
                            <p className="text-red-700">
                                "{change.old_value || '(empty)'}"
                            </p>
                        </div>
                        <p className="mt-2 text-sm">to:</p>
                        <div className="mt-1 pl-4 border-l-2 border-green-300">
                            <p className="text-green-700">
                                "{change.new_value || '(empty)'}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Actions */}
                <div className="bg-card rounded-lg border border-sidebar-border/70 p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Related Actions</h2>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/projects/${change.infrastructure_project.id}`}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                            >
                                View Project
                            </Link>
                            <Link
                                href={`/changes?project_id=${change.infrastructure_project.id}`}
                                className="px-4 py-2 border border-input rounded-md text-sm hover:bg-muted"
                            >
                                View All Changes for This Project
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
