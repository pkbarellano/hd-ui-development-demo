import HomeIcon from '@mui/icons-material/Home';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CircleIcon from '@mui/icons-material/Circle';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import PreviewIcon from '@mui/icons-material/Preview';
import ComputerIcon from '@mui/icons-material/Computer';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EmailIcon from '@mui/icons-material/Email';

import { Home as UserHome } from '../../view/user/Home';
import { Open as UserOpen } from '../../view/user/ticket/Open';
import { InProgress as UserInProgress } from '../../view/user/ticket/InProgress';
import { Resolved as UserResolved } from '../../view/user/ticket/Resolved';
import { Closed as UserClosed } from '../../view/user/ticket/Closed';
import { OpenANewTicket as UserOpenANewTicket } from '../../view/user/ticket/OpenANewTicket';
import { FrequentlyAskedQuestions as UserFrequentlyAskedQuestions } from '../../view/user/knowledgebase/FrequentlyAskedQuestions';
import { ViewTicket as UserViewTicket } from '../../view/user/ViewTicket';

import { Home as AgentHome } from '../../view/agent/Home';
import { DashboardInterface as AgentDashboardInterface } from '../../view/agent/dashboard/DashboardInterface';
import { TicketActivity as AgentTicketActivity } from '../../view/agent/dashboard/TicketActivity';
import { People as AgentPeople } from '../../view/agent/People';
import { Open as AgentOpen } from '../../view/agent/ticket/Open';
import { InProgress as AgentInProgress } from '../../view/agent/ticket/InProgress';
import { Overdue as AgentOverdue } from '../../view/agent/ticket/Overdue';
import { Resolved as AgentResolved } from '../../view/agent/ticket/Resolved';
import { Closed as AgentClosed } from '../../view/agent/ticket/Closed';
import { OpenANewTicket as AgentOpenANewTicket } from '../../view/agent/ticket/OpenANewTicket';
import { FrequentlyAskedQuestions as AgentFrequentlyAskedQuestions } from '../../view/agent/knowledgebase/FrequentlyAskedQuestions';
import { ViewTicket as AgentViewTicket } from '../../view/agent/ViewTicket';

import { SystemLog as CPanelSystemLog } from '../../view/cpanel/SystemLog';
import { Landing as CPanelLanding } from '../../view/cpanel/setting/Landing';
import { System as CPanelSystem } from '../../view/cpanel/setting/System';
import { Time as CPanelTime } from '../../view/cpanel/setting/Time';
import { TicketForm as CPanelTicketForm } from '../../view/cpanel/setting/TicketForm';
import { Knowledgebase as CPanelKnowledgebase } from '../../view/cpanel/setting/Knowledgebase';
import { AlertAndNotice as CPanelAlertAndNotice } from '../../view/cpanel/setting/AlertAndNotice';
import { Navigation as CPanelNavigation } from '../../view/cpanel/setting/Navigation';
import { SubDepartment as CPanelSubDepartment } from '../../view/cpanel/setting/SubDepartment';
import { RequestCategory as CPanelRequestCategory } from '../../view/cpanel/manage/RequestCategory';
import { CannedResponse as CPanelCannedResponse } from '../../view/cpanel/manage/CannedResponse';
import { AutoAssignment as CPanelAutoAssignment } from '../../view/cpanel/manage/AutoAssignment';
import { EmailContext as CPanelEmailContext } from '../../view/cpanel/EmailContext';
import { Client as CPanelClient } from '../../view/cpanel/account/Client';
import { Agent as CPanelAgent } from '../../view/cpanel/account/Agent';
import { Group as CPanelGroup } from '../../view/cpanel/account/Group';

const RouteList = [
    {
        id: 1,
        panel: 'USER',
        name: 'home',
        label: 'Home',
        url: '/',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 1,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <HomeIcon />,
        component: <UserHome />
    },
    {
        id: 2,
        panel: 'USER',
        name: 'tickets',
        label: 'Tickets',
        url: null,
        hasMenu: 'Y',
        hasSub: 'Y',
        firstLevel: 2,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <ConfirmationNumberIcon />,
        component: null
    },
    {
        id: 3,
        panel: 'USER',
        name: 'openTicket',
        label: 'Open',
        url: '/ticket/open',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 1,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <CircleIcon fontSize='small' />,
        component: <UserOpen />
    },
    {
        id: 4,
        panel: 'USER',
        name: 'inProgressTicket',
        label: 'In Progress',
        url: '/ticket/inprogress',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 2,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <CircleIcon fontSize='small' />,
        component: <UserInProgress />
    },
    {
        id: 5,
        panel: 'USER',
        name: 'resolvedTicket',
        label: 'Resolved',
        url: '/ticket/resolved',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 3,
        thirdLevel: 0,
        menuOrder: 3,
        icon: <CircleIcon fontSize='small' />,
        component: <UserResolved />
    },
    {
        id: 6,
        panel: 'USER',
        name: 'closedTicket',
        label: 'Closed',
        url: '/ticket/closed',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 4,
        thirdLevel: 0,
        menuOrder: 4,
        icon: <CircleIcon fontSize='small' />,
        component: <UserClosed />
    },
    {
        id: 7,
        panel: 'USER',
        name: 'openANewTicket',
        label: 'Open a New Ticket',
        url: '/ticket/opennew',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 5,
        thirdLevel: 0,
        menuOrder: 5,
        icon: <CircleIcon fontSize='small' />,
        component: <UserOpenANewTicket />
    },
    {
        id: 8,
        panel: 'USER',
        name: 'knowledgebase',
        label: 'Knowledgebase',
        url: null,
        hasMenu: 'Y',
        hasSub: 'Y',
        firstLevel: 3,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 3,
        icon: <LiveHelpIcon />,
        component: null
    },
    {
        id: 9,
        panel: 'USER',
        name: 'faq',
        label: 'Fequently Asked Questions',
        url: '/knowledgebase/faq',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 3,
        secondLevel: 1,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <CircleIcon fontSize='small' />,
        component: <UserFrequentlyAskedQuestions />
    },
    {
        id: 10,
        panel: 'USER',
        name: 'viewTicket',
        label: '',
        url: '/viewticket',
        hasMenu: 'N',
        hasSub: 'N',
        firstLevel: 4,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 4,
        icon: <PreviewIcon />,
        component: <UserViewTicket />
    },
    {
        id: 11,
        panel: 'AGENT',
        name: 'home',
        label: 'Home',
        url: '/',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 1,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <HomeIcon />,
        component: <AgentHome />
    },
    {
        id: 12,
        panel: 'AGENT',
        name: 'dashboard',
        label: 'Dashboard',
        url: null,
        hasMenu: 'Y',
        hasSub: 'Y',
        firstLevel: 2,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <DashboardIcon />,
        component: null
    },
    {
        id: 13,
        panel: 'AGENT',
        name: 'dashboard',
        label: 'Dashboard',
        url: '/dashboard/dashboard',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 1,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentDashboardInterface />
    },
    {
        id: 14,
        panel: 'AGENT',
        name: 'ticketActivity',
        label: 'Ticket Activity',
        url: '/dashboard/ticketactivity',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 2,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentTicketActivity />
    },
    {
        id: 15,
        panel: 'AGENT',
        name: 'people',
        label: 'People',
        url: '/people',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 3,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 3,
        icon: <GroupsIcon />,
        component: <AgentPeople />
    },
    {
        id: 16,
        panel: 'AGENT',
        name: 'tickets',
        label: 'Tickets',
        url: null,
        hasMenu: 'Y',
        hasSub: 'Y',
        firstLevel: 4,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 4,
        icon: <ConfirmationNumberIcon />,
        component: null
    },
    {
        id: 17,
        panel: 'AGENT',
        name: 'openTicket',
        label: 'Open',
        url: '/ticket/open',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 4,
        secondLevel: 1,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentOpen />
    },
    {
        id: 18,
        panel: 'AGENT',
        name: 'inProgressTicket',
        label: 'In Progress',
        url: '/ticket/inprogress',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 4,
        secondLevel: 2,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentInProgress />
    },
    {
        id: 19,
        panel: 'AGENT',
        name: 'overdueTicket',
        label: 'Overdue',
        url: '/ticket/overdue',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 4,
        secondLevel: 3,
        thirdLevel: 0,
        menuOrder: 3,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentOverdue />
    },
    {
        id: 20,
        panel: 'AGENT',
        name: 'resolvedTicket',
        label: 'Resolved',
        url: '/ticket/resolved',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 4,
        secondLevel: 4,
        thirdLevel: 0,
        menuOrder: 4,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentResolved />
    },
    {
        id: 21,
        panel: 'AGENT',
        name: 'closedTicket',
        label: 'Closed',
        url: '/ticket/closed',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 4,
        secondLevel: 5,
        thirdLevel: 0,
        menuOrder: 5,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentClosed />
    },
    {
        id: 22,
        panel: 'AGENT',
        name: 'openANewTicket',
        label: 'Open a New Ticket',
        url: '/ticket/openanewticket',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 4,
        secondLevel: 6,
        thirdLevel: 0,
        menuOrder: 6,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentOpenANewTicket />
    },
    {
        id: 23,
        panel: 'AGENT',
        name: 'knowledgebase',
        label: 'Knowledgebase',
        url: null,
        hasMenu: 'Y',
        hasSub: 'Y',
        firstLevel: 5,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 5,
        icon: <LiveHelpIcon />,
        component: null
    },
    {
        id: 24,
        panel: 'AGENT',
        name: 'faq',
        label: 'Frequently Asked Questions',
        url: '/knowledgebase/faq',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 5,
        secondLevel: 1,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <CircleIcon fontSize='small' />,
        component: <AgentFrequentlyAskedQuestions />
    },
    {
        id: 25,
        panel: 'AGENT',
        name: 'viewTicket',
        label: '',
        url: '/viewticket',
        hasMenu: 'N',
        hasSub: 'N',
        firstLevel: 6,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 6,
        icon: <PreviewIcon />,
        component: <AgentViewTicket />
    },
    {
        id: 26,
        panel: 'CPANEL',
        name: 'systemLogs',
        label: 'System Logs',
        url: '/systemlogs',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 1,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <ComputerIcon />,
        component: <CPanelSystemLog />
    },
    {
        id: 27,
        panel: 'CPANEL',
        name: 'settings',
        label: 'Settings',
        hasMenu: 'Y',
        hasSub: 'Y',
        firstLevel: 2,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <SettingsApplicationsIcon />,
        component: null
    },
    {
        id: 28,
        panel: 'CPANEL',
        name: 'landing',
        label: 'Landing',
        url: '/setting/landing',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 1,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelLanding />
    },
    {
        id: 29,
        panel: 'CPANEL',
        name: 'system',
        label: 'System',
        url: '/setting/system',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 2,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelSystem />
    },
    {
        id: 30,
        panel: 'CPANEL',
        name: 'time',
        label: 'Time',
        url: '/setting/time',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 3,
        thirdLevel: 0,
        menuOrder: 3,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelTime />
    },
    {
        id: 31,
        panel: 'CPANEL',
        name: 'ticketForms',
        label: 'Ticket Forms',
        url: '/setting/ticketforms',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 4,
        thirdLevel: 0,
        menuOrder: 4,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelTicketForm />
    },
    {
        id: 32,
        panel: 'CPANEL',
        name: 'knowledgebase',
        label: 'Knowledgebase',
        url: '/setting/knowledgebase',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 5,
        thirdLevel: 0,
        menuOrder: 5,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelKnowledgebase />
    },
    {
        id: 33,
        panel: 'CPANEL',
        name: 'alertsAndNotices',
        label: 'Alerts and Notices',
        url: '/setting/alertsandnotices',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 6,
        thirdLevel: 0,
        menuOrder: 6,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelAlertAndNotice />
    },
    {
        id: 34,
        panel: 'CPANEL',
        name: 'navigation',
        label: 'Navigation',
        url: '/setting/navigation',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 7,
        thirdLevel: 0,
        menuOrder: 7,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelNavigation />
    },
    {
        id: 35,
        panel: 'CPANEL',
        name: 'subDepartment',
        label: 'Sub Department',
        url: '/setting/subdepartment',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 2,
        secondLevel: 8,
        thirdLevel: 0,
        menuOrder: 8,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelSubDepartment />
    },
    {
        id: 36,
        panel: 'CPANEL',
        name: 'manage',
        label: 'Manage',
        url: null,
        hasMenu: 'Y',
        hasSub: 'Y',
        firstLevel: 3,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 3,
        icon: <BusinessCenterIcon />,
        component: null
    },
    {
        id: 37,
        panel: 'CPANEL',
        name: 'requestCategory',
        label: 'Request Category',
        url: '/manage/requestcategory',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 3,
        secondLevel: 1,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelRequestCategory />
    },
    {
        id: 38,
        panel: 'CPANEL',
        name: 'cannedResponse',
        label: 'Canned Response',
        url: '/manage/cannedresponse',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 3,
        secondLevel: 2,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelCannedResponse />
    },
    {
        id: 39,
        panel: 'CPANEL',
        name: 'autoAssignment',
        label: 'Auto Assignment',
        url: '/manage/autoassignment',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 3,
        secondLevel: 3,
        thirdLevel: 0,
        menuOrder: 3,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelAutoAssignment />
    },
    {
        id: 40,
        panel: 'CPANEL',
        name: 'emailContext',
        label: 'Email Context',
        url: '/emailcontext',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 4,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 4,
        icon: <EmailIcon />,
        component: <CPanelEmailContext />
    },
    {
        id: 41,
        panel: 'CPANEL',
        name: 'people',
        label: 'People',
        url: null,
        hasMenu: 'Y',
        hasSub: 'Y',
        firstLevel: 5,
        secondLevel: 0,
        thirdLevel: 0,
        menuOrder: 5,
        icon: <GroupsIcon />,
        component: null
    },
    {
        id: 42,
        panel: 'CPANEL',
        name: 'clients',
        label: 'Clients',
        url: '/account/client',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 5,
        secondLevel: 1,
        thirdLevel: 0,
        menuOrder: 1,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelClient />
    },
    {
        id: 43,
        panel: 'CPANEL',
        name: 'agents',
        label: 'Agents',
        url: '/account/agent',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 5,
        secondLevel: 2,
        thirdLevel: 0,
        menuOrder: 2,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelAgent />
    },
    {
        id: 44,
        panel: 'CPANEL',
        name: 'groups',
        label: 'Groups',
        url: '/account/group',
        hasMenu: 'Y',
        hasSub: 'N',
        firstLevel: 5,
        secondLevel: 3,
        thirdLevel: 0,
        menuOrder: 3,
        icon: <CircleIcon fontSize='small' />,
        component: <CPanelGroup />
    }
];

export default RouteList;