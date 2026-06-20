import { Calendar, CheckCircle2, ClipboardList, FileText, MoreHorizontal, Pencil, Plus } from "lucide-react";

export function AssignmentsTab() {

    const ASSIGNMENTS = [
        {
            id: '1',
            title: 'RAG vs DEAD: Compare and Contrast',
            description: 'Write a 500-word analysis comparing the RAG approach with the DEAD framework.',
            dueDate: 'May 25, 2026',
            status: 'Active',
            submissions: 42,
            totalLearners: 254,
            type: 'Essay',
        },
        {
            id: '2',
            title: 'Build a Context Window Optimizer',
            description: 'Implement a basic context window optimizer using the concepts from video 03.',
            dueDate: 'May 28, 2026',
            status: 'Active',
            submissions: 18,
            totalLearners: 254,
            type: 'Project',
        },
        {
            id: '3',
            title: 'Quiz: Traditional RAG Concepts',
            description: 'Test your understanding of traditional RAG architecture and its limitations.',
            dueDate: 'May 22, 2026',
            status: 'Completed',
            submissions: 189,
            totalLearners: 254,
            type: 'Quiz',
        },
        {
            id: '4',
            title: 'Data Pipeline Design Challenge',
            description: 'Design a smarter data pipeline using the DEAD framework principles.',
            dueDate: 'Jun 1, 2026',
            status: 'Draft',
            submissions: 0,
            totalLearners: 254,
            type: 'Project',
        },
    ];

    return (
        <div className="mt-4 space-y-3">
            {/* Assignments toolbar */}
            <div className="flex items-center justify-between">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80">
                    {ASSIGNMENTS.length} Assignments
                </span>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                    <Plus size={15} />
                    Create assignment
                </button>
            </div>

            {/* Assignment cards */}
            <div className="space-y-2">
                {ASSIGNMENTS.map((assignment) => {
                    const typeIcons: Record<string, typeof FileText> = {
                        Essay: FileText,
                        Project: ClipboardList,
                        Quiz: CheckCircle2,
                    };
                    const TypeIcon = typeIcons[assignment.type] ?? FileText;

                    return (
                        <div
                            key={assignment.id}
                            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition hover:border-white/10 hover:bg-white/[0.04]"
                        >
                            <div className="flex items-start gap-4">
                                {/* Type icon */}
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                                    <TypeIcon size={18} className="text-cyan-300" />
                                </div>

                                {/* Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium text-white">{assignment.title}</h4>
                                        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/50">
                                            {assignment.type}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs leading-relaxed text-white/40">
                                        {assignment.description}
                                    </p>
                                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar size={11} />
                                            Due {assignment.dueDate}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <CheckCircle2 size={11} />
                                            {assignment.submissions}/{assignment.totalLearners} submitted
                                        </span>
                                    </div>
                                </div>

                                {/* Status + actions */}
                                <div className="flex items-center gap-3">

                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white/70"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white/70"
                                    >
                                        <MoreHorizontal size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}