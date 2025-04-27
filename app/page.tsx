"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { format } from "date-fns"
import NewIncidentForm from "@/components/new-incident-form"
import type { Incident } from "@/lib/types"

// Mock data
const initialIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description: "Algorithm consistently favored certain demographics...",
    severity: "Medium",
    reported_at: "2025-03-15T10:00:00Z",
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description: "LLM provided incorrect safety procedure information...",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z",
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description: "Chatbot inadvertently exposed non-sensitive user metadata...",
    severity: "Low",
    reported_at: "2025-03-20T09:15:00Z",
  },
]

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [expandedIncidentId, setExpandedIncidentId] = useState<number | null>(null)
  const [severityFilter, setSeverityFilter] = useState<string>("All")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [showForm, setShowForm] = useState(false)

  // Filter incidents by severity
  const filteredIncidents = incidents.filter((incident) => {
    if (severityFilter === "All") return true
    return incident.severity === severityFilter
  })

  // Sort incidents by reported date
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const dateA = new Date(a.reported_at).getTime()
    const dateB = new Date(b.reported_at).getTime()
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  // Toggle incident details
  const toggleIncidentDetails = (id: number) => {
    setExpandedIncidentId(expandedIncidentId === id ? null : id)
  }

  // Add new incident
  const addIncident = (incident: Omit<Incident, "id" | "reported_at">) => {
    const newIncident: Incident = {
      ...incident,
      id: incidents.length > 0 ? Math.max(...incidents.map((i) => i.id)) + 1 : 1,
      reported_at: new Date().toISOString(),
    }
    setIncidents([...incidents, newIncident])
    setShowForm(false)
  }

  // Get badge color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-yellow-500"
      case "Medium":
        return "bg-orange-500"
      case "High":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="bg-slate-50">
          <CardTitle className="text-2xl font-bold">AI Safety Incident Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="severity-filter" className="text-sm font-medium">
                  Filter by Severity
                </label>
                <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value)}>
                  <SelectTrigger id="severity-filter" className="w-[180px]">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sort-order" className="text-sm font-medium">
                  Sort by Date
                </label>
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
                  <SelectTrigger id="sort-order" className="w-[180px]">
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => setShowForm(!showForm)} className="self-end">
              <Plus className="mr-2 h-4 w-4" />
              Report New Incident
            </Button>
          </div>

          {showForm && (
            <div className="mb-8">
              <NewIncidentForm onSubmit={addIncident} onCancel={() => setShowForm(false)} />
            </div>
          )}

          <div className="space-y-4">
            {sortedIncidents.length > 0 ? (
              sortedIncidents.map((incident) => (
                <Card key={incident.id} className="overflow-hidden">
                  <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">{incident.title}</h3>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500">
                        <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                        <span>Reported: {format(new Date(incident.reported_at), "MMM d, yyyy 'at' h:mm a")}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleIncidentDetails(incident.id)}
                      className="ml-auto"
                    >
                      {expandedIncidentId === incident.id ? (
                        <>
                          Hide Details
                          <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View Details
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  {expandedIncidentId === incident.id && (
                    <CardContent className="border-t bg-slate-50 pt-4">
                      <h4 className="font-medium mb-2">Description:</h4>
                      <p className="text-gray-700">{incident.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No incidents found matching the current filters.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
