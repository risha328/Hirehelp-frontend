'use client';

import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Eye, Download, User, FileText, Clock, CheckCircle, XCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { applicationsAPI, Application } from '../api/applications';
import { Round, MCQResponse } from '../api/rounds';
import { API_BASE_URL } from '../api/config';

interface KanbanBoardProps {
  applications: Application[];
  rounds?: Round[];
  mcqResponses?: MCQResponse[];
  onApplicationUpdate: () => void;
  onViewDetails: (application: Application) => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  icon: React.ReactNode;
  roundId?: string;
  applications: Application[];
}

export default function KanbanBoard({ applications, rounds = [], mcqResponses = [], onApplicationUpdate, onViewDetails }: KanbanBoardProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState<{ application: Application, newStatus: string, newRoundId?: string } | null>(null);

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

  const columns: KanbanColumn[] = useMemo(() => {
    const cols: KanbanColumn[] = [];

    // 1. Applied Column
    cols.push({
      id: 'applied',
      title: 'Applied',
      status: 'APPLIED',
      color: 'bg-blue-100 border-blue-300',
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      applications: applications.filter(app => app.status === 'APPLIED')
    });

    // 2. Dynamic Round Columns or Default Under Review
    if (rounds && rounds.length > 0) {
      rounds.forEach((round, index) => {
        // Filter applications that are UNDER_REVIEW and in this specific round
        // OR if it's the first round, include UNDER_REVIEW apps with no round assigned
        const roundApps = applications.filter(app => {
          if (app.status !== 'UNDER_REVIEW') return false;

          if (app.currentRound) {
            // Check if app.currentRound is an object (populated) or string
            const currentRoundId = typeof app.currentRound === 'object' ? (app.currentRound as any)._id : app.currentRound;
            return String(currentRoundId) === String(round._id);
          } else {
            // If no current round, assign to first round
            return index === 0;
          }
        });

        cols.push({
          id: `round_${round._id}`,
          title: round.name,
          status: 'UNDER_REVIEW',
          roundId: round._id,
          color: 'bg-yellow-100 border-yellow-300',
          icon: <Eye className="h-5 w-5 text-yellow-600" />,
          applications: roundApps
        });
      });
    } else {
      cols.push({
        id: 'under_review',
        title: 'Under Review',
        status: 'UNDER_REVIEW',
        color: 'bg-yellow-100 border-yellow-300',
        icon: <Eye className="h-5 w-5 text-yellow-600" />,
        applications: applications.filter(app => app.status === 'UNDER_REVIEW')
      });
    }

    // 3. Shortlisted
    cols.push({
      id: 'shortlisted',
      title: 'Shortlisted',
      status: 'SHORTLISTED',
      color: 'bg-purple-100 border-purple-300',
      icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
      applications: applications.filter(app => app.status === 'SHORTLISTED')
    });

    // 4. Hired
    cols.push({
      id: 'hired',
      title: 'Hired',
      status: 'HIRED',
      color: 'bg-green-100 border-green-300',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      applications: applications.filter(app => app.status === 'HIRED')
    });

    // 5. Rejected
    cols.push({
      id: 'rejected',
      title: 'Rejected',
      status: 'REJECTED',
      color: 'bg-red-100 border-red-300',
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      applications: applications.filter(app => app.status === 'REJECTED')
    });

    return cols;
  }, [applications, rounds]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const application = applications.find(app => app._id === draggableId);
    if (!application) return;

    // Determine new status and round
    let newStatus = destColumn.status;
    let newRoundId = destColumn.roundId;

    // Check for confirmations
    let requiresConfirmation = false;

    // Status change confirmations
    if (application.status !== newStatus) {
      const confirmTransitions = [
        { from: 'APPLIED', to: 'UNDER_REVIEW' },
        { from: 'UNDER_REVIEW', to: 'SHORTLISTED' },
        { from: 'SHORTLISTED', to: 'HIRED' },
        { from: 'SHORTLISTED', to: 'REJECTED' }
      ];
      requiresConfirmation = confirmTransitions.some(
        transition => transition.from === application.status && transition.to === newStatus
      );
    }

    if (requiresConfirmation) {
      setConfirmData({ application, newStatus, newRoundId });
      setShowConfirmModal(true);
      return;
    }

    // Execute update
    await executeUpdate(application._id, newStatus, newRoundId);
  };

  const executeUpdate = async (appId: string, status: string, roundId?: string) => {
    setIsUpdating(appId);
    try {
      await applicationsAPI.updateApplicationStatus(appId, status, undefined, roundId);
      onApplicationUpdate();
    } catch (error) {
      console.error('Failed to update application status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleConfirm = async () => {
    if (!confirmData) return;
    setShowConfirmModal(false);
    await executeUpdate(confirmData.application._id, confirmData.newStatus, confirmData.newRoundId);
    setConfirmData(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmData(null);
  };

  // Helper to get MCQ info with Safe ID Comparison
  const getMcqInfo = (appId: string, roundId?: string) => {
    if (!roundId || !mcqResponses) return null;
    return mcqResponses.find(r => {
      const rAppId = typeof r.applicationId === 'object' ? (r.applicationId as any)._id : r.applicationId;
      const rRoundId = typeof r.roundId === 'object' ? (r.roundId as any)._id : r.roundId;
      return String(rAppId) === String(appId) && String(rRoundId) === String(roundId);
    });
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
                      className={`flex-1 space-y-3 min-h-[200px] rounded-md transition-colors ${snapshot.isDraggingOver ? 'bg-white bg-opacity-50' : ''
                        }`}
                    >
                      {column.applications.map((application, index) => {
                        const mcqInfo = column.roundId ? getMcqInfo(application._id, column.roundId) : null;

                        return (
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
                                className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
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

                                {/* MCQ Status Badge */}
                                {mcqInfo && (
                                  <div className={`mb-3 flex items-center p-2 rounded text-xs font-medium ${mcqInfo.score && mcqInfo.score >= 70 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    {mcqInfo.score && mcqInfo.score >= 70 ? (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                    )}
                                    MCQ: {mcqInfo.score?.toFixed(0)}%
                                    {mcqInfo.isSubmitted ? ' (Submitted)' : ' (In Progress)'}
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
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showConfirmModal && confirmData && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirm Status Change</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to change the status from {getStatusConfig(confirmData.application.status).title} to {
                confirmData.newRoundId
                  ? rounds.find(r => r._id === confirmData.newRoundId)?.name || 'Next Round'
                  : getStatusConfig(confirmData.newStatus).title
              }?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
