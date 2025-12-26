"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, FileText, Video, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import CreateResourceForm from "@/components/forms/CreateResourceForm";
import { NoData } from "@/components/ui/no-data";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MOCK_RESOURCES: Resource[] = [
    {
        _id: "mock-r1",
        title: "React Hooks Comprehensive Guide",
        description: "A deep dive into useState, useEffect, and custom hooks for building modern React applications.",
        type: "PDF",
        url: "#",
        createdAt: "2024-03-10"
    },
    {
        _id: "mock-r2",
        title: "Advanced CSS Grid Layouts",
        description: "Learn how to build complex, responsive grid layouts with ease using modern CSS techniques.",
        type: "Video",
        url: "#",
        createdAt: "2024-03-12"
    },
    {
        _id: "mock-r3",
        title: "Official React Documentation",
        description: "Direct link to the official React docs. Always the best place to start.",
        type: "Link",
        url: "https://react.dev",
        createdAt: "2024-01-01"
    }
];

interface Resource {
    _id: string;
    title: string;
    description?: string;
    type: "Link" | "PDF" | "Video";
    url: string;
    createdAt?: string;
}

interface ResourceListProps {
    mode: "admin" | "trainer" | "student";
    token: string;
    canCreate?: boolean;
}

export default function ResourceList({ mode, token, canCreate = false }: ResourceListProps) {
    const router = useRouter();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchResources = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await axios.get(`${BASE_URL}/api/v1/material/getAllMaterials`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.data || res.data || [];
            const finalData = Array.isArray(data) ? data : [];

            // Mock Data Fallback for Trainer Design Verification
            if (mode === 'trainer' && finalData.length === 0) {
                 setResources(MOCK_RESOURCES);
            } else {
                 setResources(finalData);
            }
        } catch (error) {
            console.error("Failed to fetch resources", error);
            toast.error("Failed to load resources");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [token]);

    const handleSuccess = () => {
        setIsCreateOpen(false);
        fetchResources();
    };
    
    const handleResourceClick = (id: string, url: string) => {
        // Option 1: Navigate to details page
         // const basePath = mode === 'admin' ? '/admin/resources' : '/trainer/resources';
         // router.push(`${basePath}/${id}`);

        // Option 2 (Current behavior): Open URL directly.
        // But user asked for details component usage.
        // So let's route to details.
        
        const basePath = mode === 'admin' ? '/admin/resources' : (mode === 'trainer' ? '/trainer/resources' : '/student/resources');
        
        // Note: Students might not have details page if not needed, but sticking to consistency.
        router.push(`${basePath}/${id}`);
    };

    // Filter Logic
    const filteredResources = resources.filter(res => 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getIcon = (type: string) => {
        switch (type) {
            case "PDF": return <FileText size={16} />;
            case "Video": return <Video size={16} />;
            default: return <LinkIcon size={16} />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "PDF": return "bg-red-50 text-red-600 border-red-200";
            case "Video": return "bg-blue-50 text-blue-600 border-blue-200";
            default: return "bg-indigo-50 text-indigo-600 border-indigo-200";
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full relative min-h-[calc(100vh-150px)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h1 className="text-2xl font-bold tracking-tight text-foreground">Resources</h1>
                   <p className="text-muted-foreground">Access and share learning materials.</p>
                </div>
                
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full md:w-[250px]"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="w-full flex-1">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
                    </div>
                ) : filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((res) => (
                            <div 
                                key={res._id} 
                                onClick={() => handleResourceClick(res._id, res.url)}
                                className="group relative p-6 border rounded-xl bg-card hover:bg-muted/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col h-full cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium flex items-center gap-1.5 ${getTypeColor(res.type)}`}>
                                        {getIcon(res.type)}
                                        {res.type}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                                    {res.description || "No description provided."}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-border/50">
                                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors w-full justify-between">
                                       <span>View Details</span>
                                       <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <NoData 
                        message="No Resources Found" 
                        description={canCreate ? "Create a new resource to get started." : "No learning materials available at the moment."}
                    />
                )}
            </div>

            {/* FAB */}
            {canCreate && (
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <button className="fixed bottom-24 md:bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 ease-in-out z-50 group">
                            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add New Resource</DialogTitle>
                            <DialogDescription>
                                Add a link, PDF, or video resource for your students.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                            <CreateResourceForm onSuccess={handleSuccess} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
