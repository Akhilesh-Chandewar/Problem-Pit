"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Code2, FileText, Lightbulb, BookOpen, CheckCircle2, Download } from "lucide-react";

import { sampledpData, sampleStringProblem } from "@/module/problems/sample/sampleProblems";

/** ----------------- Zod Schema ----------------- */
const problemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1),
  constraints: z.string().min(1),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1) })).min(1),
  examples: z.object({
    JAVASCRIPT: z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().optional() }),
    PYTHON: z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().optional() }),
    JAVA: z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().optional() }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1),
    PYTHON: z.string().min(1),
    JAVA: z.string().min(1),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1),
    PYTHON: z.string().min(1),
    JAVA: z.string().min(1),
  }),
});

/** ----------------- Monaco Editor ----------------- */
const CodeEditor = ({ value = "", onChange = () => {}, language = "javascript" }) => {
  const languageMap = { javascript: "javascript", python: "python", java: "java" };
  return (
    <div className="border rounded-md bg-slate-950 text-slate-50">
      <div className="px-4 py-2 bg-slate-800 border-b text-sm font-mono">{language}</div>
      <div className="h-[300px] w-full">
        <Editor
          height="300px"
          defaultLanguage={languageMap[language] }
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{ minimap: { enabled: false }, fontSize: 18, lineNumbers: "on", wordWrap: "on", formatOnPaste: true, formatOnType: true, automaticLayout: true }}
        />
      </div>
    </div>
  );
};

/** ----------------- Main Component ----------------- */
const CreateProblemForm = () => {
  const router = useRouter();
  const [sampleType, setSampleType] = useState("DP");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      tags: [""],
      constraints: "",
      hints: "",
      editorial: "",
      testCases: [{ input: "", output: "" }],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  /** --- Tags --- */
  const { fields: tagFields, append: appendTag, remove: removeTag, replace: replaceTags } = useFieldArray({ control, name: "tags" });
  /** --- Test Cases --- */
  const { fields: testCaseFields, append: appendTestCase, remove: removeTestCase, replace: replaceTestCases } = useFieldArray({ control, name: "testCases" });

  /** --- Submit Handler --- */
  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/create-problem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!response.ok) throw new Error("Failed to create problem");
      toast.success("Problem created successfully");
      router.push("/problems");
    } catch (err : any) {
      toast.error(err.message || "Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  /** --- Load Sample Data --- */
  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceTags(sampleData.tags);
    replaceTestCases(sampleData.testCases);
    reset(sampleData);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-3xl flex items-center gap-3">
              <FileText className="w-8 h-8 text-amber-600" /> Create Problem
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex border rounded-md">
                <Button variant={sampleType === "DP" ? "default" : "outline"} size="sm" className="rounded-r-none" onClick={() => setSampleType("DP")}>DP Problem</Button>
                <Button variant={sampleType === "string" ? "default" : "outline"} size="sm" className="rounded-l-none" onClick={() => setSampleType("string")}>String Problem</Button>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={loadSampleData} className="gap-2"><Download className="w-4 h-4" /> Load Sample</Button>
            </div>
          </div>
          <Separator />
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label>Title</Label>
                <Input {...register("title")} className="mt-2 text-lg" />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea {...register("description")} className="mt-2 min-h-32 resize-y text-base" />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <Label>Difficulty</Label>
                <Controller name="difficulty" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="mt-2"><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY"><Badge className="bg-green-100 text-green-800">Easy</Badge></SelectItem>
                      <SelectItem value="MEDIUM"><Badge className="bg-amber-100 text-amber-800">Medium</Badge></SelectItem>
                      <SelectItem value="HARD"><Badge className="bg-red-100 text-red-800">Hard</Badge></SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>

            {/* Tags */}
            <Card className="bg-amber-50 dark:bg-amber-950/20">
              <CardHeader className="pb-4 flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-600" /> Tags</CardTitle>
                <Button type="button" size="sm" onClick={() => appendTag("")} className="gap-2"><Plus className="w-4 h-4" /> Add Tag</Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <Input {...register(`tags.${index}`)} placeholder="Enter tag" className="flex-1" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeTag(index)} disabled={tagFields.length === 1} className="p-2"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card className="bg-green-50 dark:bg-green-950/20">
              <CardHeader className="pb-4 flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /> Test Cases</CardTitle>
                <Button type="button" size="sm" onClick={() => appendTestCase({ input: "", output: "" })} className="gap-2"><Plus className="w-4 h-4" /> Add Test Case</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {testCaseFields.map((field, index) => (
                  <Card key={field.id} className="bg-background">
                    <CardHeader className="pb-4 flex justify-between items-center">
                      <CardTitle className="text-lg">Test Case #{index + 1}</CardTitle>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeTestCase(index)} disabled={testCaseFields.length === 1} className="text-red-500 gap-2"><Trash2 className="w-4 h-4" /> Remove</Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Input</Label>
                        <Textarea {...register(`testCases.${index}.input`)} className="mt-2 min-h-24 resize-y font-mono" />
                      </div>
                      <div>
                        <Label>Expected Output</Label>
                        <Textarea {...register(`testCases.${index}.output`)} className="mt-2 min-h-24 resize-y font-mono" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Code + Reference + Examples */}
            {["JAVASCRIPT", "PYTHON", "JAVA"].map(language => (
              <Card key={language} className="bg-slate-50 dark:bg-slate-950/20">
                <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Code2 className="w-5 h-5 text-slate-600" /> {language}</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {/* Starter Code */}
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Starter Code Template</CardTitle></CardHeader>
                    <CardContent>
                      <Controller name={`codeSnippets.${language}`} control={control} render={({ field }) => <CodeEditor value={field.value} onChange={field.onChange} language={language.toLowerCase()} />} />
                    </CardContent>
                  </Card>

                  {/* Reference */}
                  <Card>
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /> Reference Solution</CardTitle></CardHeader>
                    <CardContent>
                      <Controller name={`referenceSolutions.${language}`} control={control} render={({ field }) => <CodeEditor value={field.value} onChange={field.onChange} language={language.toLowerCase()} />} />
                    </CardContent>
                  </Card>

                  {/* Examples */}
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Example</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><Label>Input</Label><Textarea {...register(`examples.${language}.input`)} className="mt-2 min-h-20 resize-y font-mono" /></div>
                      <div><Label>Output</Label><Textarea {...register(`examples.${language}.output`)} className="mt-2 min-h-20 resize-y font-mono" /></div>
                      <div className="md:col-span-2"><Label>Explanation</Label><Textarea {...register(`examples.${language}.explanation`)} className="mt-2 min-h-24 resize-y" /></div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            ))}

            {/* Additional Info */}
            <Card className="bg-amber-50 dark:bg-amber-950/20">
              <CardHeader><CardTitle className="text-xl flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-600" /> Additional Information</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div><Label>Constraints</Label><Textarea {...register("constraints")} className="mt-2 min-h-24 resize-y font-mono" /></div>
                <div><Label>Hints (Optional)</Label><Textarea {...register("hints")} className="mt-2 min-h-24 resize-y" /></div>
                <div><Label>Editorial (Optional)</Label><Textarea {...register("editorial")} className="mt-2 min-h-32 resize-y" /></div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <Button type="submit" size="lg" disabled={isLoading} className="gap-2">
                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-5 h-5" />} Create Problem
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProblemForm;
