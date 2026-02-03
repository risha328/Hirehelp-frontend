'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Eye, Download, User, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { applicationsAPI, Application } from '../api/applications';
import { API_BASE_URL } from '../api/config';

interface KanbanBoardProps {
  applications: Application[];
  onApplicationUpdate: () => void;
  onViewDetails: (application: Application) => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  icon: React.ReactNode;
  applications: Application[];
}

export default function KanbanBoard({ applications, onApplicationUpdate, onViewDetails }: KanbanBoardProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return { color: 'bg-blue-100 border-blue-300', icon: <Clock className="h-5 w-5 text-blue-600" />, title: 'Applied' };
      case 'UNDER_REVIEW':
        return { color: 'bg-yellow-100 border-yellow-300', icon: <Eye className="h-5 w-5 text-yellow-600" />, title: 'Under Review' };
      case 'SHORTLISTED':
        return { color: 'bg-purple-100 border-purple-300', icon: <CheckCircle className="h-5 w-5 text-purple-600" />, title: 'Shortlisted' };
      case 'HIRED':
        return { color: 'bg-green-100 border-green-300', icon: <CheckCircle className="h-5 w-5 text-green-600" />, title: 'Hired' };
      case 'REJECTED':
        return { color: 'bg-red-100 border-red-300', icon: <XCircle className="h-5 w-5 text-red-600" />, title: 'Rejected' };
      default:
        return { color: 'bg-gray-100 border-gray-300', icon: <Clock className="h-5 w-5 text-gray-600" />, title: status };
    }
  };

  const columns: KanbanColumn[] = [
    {
      id: 'applied',
      title: 'Applied',
      status: 'APPLIED',
      color: 'bg-blue-100 border-blue-300',
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      applications: applications.filter(app => app.status === 'APPLIED')
    },
    {
      id: 'under_review',
      title: 'Under Review',
      status: 'UNDER_REVIEW',
      color: 'bg-yellow-100 border-yellow-300',
      icon: <Eye className="h-5 w-5 text-yellow-600" />,
      applications: applications.filter(app => app.status === 'UNDER_REVIEW')
    },
    {
      id: 'shortlisted',
      title: 'Shortlisted',
      status: 'SHORTLISTED',
      color: 'bg-purple-100 border-purple-300',
      icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
      applications: applications.filter(app => app.status === 'SHORTLISTED')
    },
    {
      id: 'hired',
      title: 'Hired',
      status: 'HIRED',
      color: 'bg-green-100 border-green-300',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      applications: applications.filter(app => app.status === 'HIRED')
    },
    {
      id: 'rejected',
      title: 'Rejected',
      status: 'REJECTED',
      color: 'bg-red-100 border-red-300',
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      applications: applications.filter(app => app.status === 'REJECTED')
    }
  ];

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Find the application being moved
    const application = applications.find(app => app._id === draggableId);
    if (!application) return;

    // Check if the status change is valid
    const validTransitions: { [key: string]: string[] } = {
      'APPLIED': ['UNDER_REVIEW', 'REJECTED'],
      'UNDER_REVIEW': ['SHORTLISTED', 'REJECTED', 'APPLIED'],
      'SHORTLISTED': ['HIRED', 'REJECTED', 'UNDER_REVIEW'],
      'HIRED': [],
      'REJECTED': []
    };

    if (!validTransitions[application.status]?.includes(destColumn.status)) {
      // Invalid transition - you could show a toast notification here
      console.log('Invalid status transition');
      return;
    }

    // Update the application status
    setIsUpdating(draggableId);
    try {
      await applicationsAPI.updateApplicationStatus(application._id, destColumn.status);
      onApplicationUpdate();
    } catch (error) {
      console.error('Failed to update application status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 h-full overflow-x-auto pb-6">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className={`${column.color} rounded-lg p-4 border-2 min-h-[600px] flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {column.icon}
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  </div>
                  <span className="bg-white bg-opacity-50 text-gray-700 text-sm font-medium px-2 py-1 rounded-full">
                    {column.applications.length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 min-h-[200px] rounded-md transition-colors ${
                        snapshot.isDraggingOver ? 'bg-white bg-opacity-50' : ''
                      }`}
                    >
                      {column.applications.map((application, index) => (
                        <Draggable
                          key={application._id}
                          draggableId={application._id}
                          index={index}
                          isDragDisabled={isUpdating === application._id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
                              } ${isUpdating === application._id ? 'opacity-50' : ''}`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-gray-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 text-sm">
                                      {application.candidateId.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                      {application.candidateId.email}
                                    </p>
                                  </div>
                                </div>
                                {isUpdating === application._id && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                )}
                              </div>

                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {application.jobId.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Applied {new Date(application.createdAt).toLocaleDateString()}
                                </p>
                              </div>

                              {application.coverLetter && (
                                <div className="mb-3">
                                  <p className="text-xs text-gray-700 line-clamp-2">
                                    {application.coverLetter}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => window.location.href = `/companyadmin/candidates/${application.candidateId._id}`}
                                    className="p-1 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  {application.resumeUrl && (
                                    <a
                                      href={`${API_BASE_URL}${application.resumeUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                      title="Download Resume"
                                    >
                                      <Download className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {application.candidateId.phone || 'No phone'}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
