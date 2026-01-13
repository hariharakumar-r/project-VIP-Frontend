import { useEffect, useRef, useState } from "react";
import { Video, Loader, AlertCircle } from "lucide-react";

// Note: This component requires @zoom/meetingsdk to be installed
// npm install @zoom/meetingsdk

export default function ZoomMeeting({ 
  interviewId, 
  onMeetingEnd, 
  onMeetingStart,
  className = "" 
}) {
  const meetingRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!interviewId) return;

    const initializeMeeting = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch meeting data and SDK token
        const response = await fetch(`/api/interviews/${interviewId}/zoom-token`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to get meeting data');
        }

        const data = await response.json();
        setMeetingData(data);

        // Dynamically import Zoom SDK
        const { default: ZoomMtgEmbedded } = await import('@zoom/meetingsdk/embedded');
        
        const zoomClient = ZoomMtgEmbedded.createClient();
        setClient(zoomClient);

        // Initialize the SDK
        await zoomClient.init({
          zoomAppRoot: meetingRef.current,
          language: 'en-US',
          customize: {
            meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
            toolbar: {
              buttons: [
                {
                  text: 'Custom Button',
                  className: 'CustomButton',
                  onClick: () => {
                    console.log('Custom button clicked');
                  }
                }
              ]
            }
          }
        });

        // Join the meeting
        await zoomClient.join({
          sdkKey: data.sdkKey,
          signature: data.signature,
          meetingNumber: data.meetingNumber,
          password: data.password,
          userName: data.userName,
          userEmail: data.userEmail
        });

        // Set up event listeners
        zoomClient.on('meeting-status', (status) => {
          console.log('Meeting status:', status);
          if (status === 'started' && onMeetingStart) {
            onMeetingStart();
          }
          if (status === 'ended' && onMeetingEnd) {
            onMeetingEnd();
          }
        });

        setLoading(false);

      } catch (err) {
        console.error('Failed to initialize Zoom meeting:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeMeeting();

    // Cleanup
    return () => {
      if (client) {
        client.leave().catch(console.error);
      }
    };
  }, [interviewId, onMeetingEnd, onMeetingStart]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Initializing Zoom meeting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-96 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-800 font-medium mb-2">Failed to load meeting</p>
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={meetingRef} 
        className="w-full h-full min-h-96 bg-black rounded-lg overflow-hidden"
        style={{ minHeight: '600px' }}
      />
      
      {/* Meeting Info Overlay */}
      {meetingData && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span>Meeting ID: {meetingData.meetingNumber}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback component when Zoom SDK is not available
export function ZoomMeetingFallback({ zoomJoinUrl, meetingId, password }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
      <Video className="w-12 h-12 mx-auto mb-4 text-blue-600" />
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Join Zoom Meeting</h3>
      <p className="text-blue-700 mb-4">
        Click the button below to join the meeting in a new window
      </p>
      
      <div className="space-y-2 mb-4 text-sm text-blue-600">
        <div>Meeting ID: <span className="font-mono">{meetingId}</span></div>
        {password && <div>Password: <span className="font-mono">{password}</span></div>}
      </div>
      
      <a
        href={zoomJoinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Video className="w-4 h-4" />
        Join Meeting
      </a>
    </div>
  );
}