import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, { timelineContentClasses } from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

function DroneTimeline(props) {
    const droneStages = [
        "PREPARE",
        "READY",
        "PATH",
        "TAKEOFF",
        "FLIGHT",
        "RETURN",
        "RAPORT",
    ]

    return (
        <Timeline>
            {droneStages.map((droneStage, index) => <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                    {index + 1}
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    {index < (droneStages.length - 1) ? <TimelineConnector /> : <></>}
                </TimelineSeparator>
                {props.stageId === (index + 1) ? <TimelineContent color="red">{droneStage}</TimelineContent>
                    : <TimelineContent>{droneStage}</TimelineContent>}
            </TimelineItem>)}
        </Timeline>

    )
}

export default DroneTimeline
