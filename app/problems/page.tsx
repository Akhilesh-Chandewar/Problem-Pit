'use client';

import { getAllProblems } from '@/modules/problems/actions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, Code, Loader2 } from 'lucide-react';
import { ProblemDifficulty } from '@/lib/generated/prisma/enums';

interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: ProblemDifficulty;
    tags: string[];
    createdAt: Date;
}

const getDifficultyColor = (difficulty: ProblemDifficulty) => {
    switch (difficulty) {
        case 'EASY':
            return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30';
        case 'MEDIUM':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30';
        case 'HARD':
            return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const ProblemsPage = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const result = await getAllProblems();
                if (result.success && result.data) {
                    setProblems(result.data as Problem[]);
                }
            } catch (error) {
                console.error('Error fetching problems:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'ALL' || problem.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Problems</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} available
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search problems..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-full md:w-45">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Difficulties</SelectItem>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filteredProblems.length === 0 ? (
                <Card className="p-12 text-center">
                    <CardContent className="pt-6">
                        <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No problems found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {searchQuery || difficultyFilter !== 'ALL'
                                ? 'Try adjusting your filters'
                                : 'No problems available yet'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProblems.map((problem) => (
                        <Link key={problem.id} href={`/problem/${problem.id}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-orange-100 dark:border-orange-900/30">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-lg font-semibold line-clamp-1">
                                            {problem.title}
                                        </CardTitle>
                                        <Badge className={getDifficultyColor(problem.difficulty)}>
                                            {problem.difficulty}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="line-clamp-2 mb-4">
                                        {problem.description}
                                    </CardDescription>
                                    <div className="flex flex-wrap gap-1">
                                        {problem.tags.slice(0, 3).map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                        {problem.tags.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{problem.tags.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProblemsPage;
