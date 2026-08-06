// Demo-mode mock backend.
//
// This intercepts every request the real app makes to its Node/API backend
// and answers with static demo data instead. It is only ever activated when
// REACT_APP_DEMO_MODE=true is set at build time (see package.json's
// "build:demo" script and the GitHub Actions workflow) — a normal
// `npm run build` against a real backend is completely unaffected.
//
// Nothing here is persisted anywhere real: "created" clients live in a
// module-level array that resets the moment the page is refreshed.

import MockAdapter from 'axios-mock-adapter';

import axios from '../Axios';
import RouteList from '../hoc/router/RouteList';
import {
    ACCOUNTS,
    DEPARTMENTS,
    GROUPS,
    CLIENT_TYPES,
    seedClients,
    CLIENT_COLUMN_TO_FIELD
} from './demoData';

let mockInstance = null;
let clientRows = null;

const parseBody = (config) => {
    try {
        return config.data ? JSON.parse(config.data) : {};
    } catch (err) {
        return {};
    }
};

const encodeSessionKey = (username) => `demo.${btoa(username)}`;

const decodeSessionKey = (sessionKey) => {
    try {
        return atob(String(sessionKey).replace(/^demo\./, ''));
    } catch (err) {
        return null;
    }
};

// Rebuilds the { firstLevel: { rows }, secondLevel: { rows }, thirdLevel: { rows } }
// shape RouterComponent/AppDrawerMenu expect, directly from RouteList — so every
// route defined there is automatically enabled in the demo, with no need to keep
// a second hand-written list in sync.
const buildPanelNavigation = (panel) => {
    const entries = RouteList.filter((r) => r.panel === panel);

    const toRow = (r) => ({
        Navigation: {
            firstLevel: r.firstLevel,
            secondLevel: r.secondLevel,
            thirdLevel: r.thirdLevel,
            hasSub: r.hasSub
        }
    });

    return {
        firstLevel: { rows: entries.filter((r) => r.secondLevel === 0 && r.thirdLevel === 0).map(toRow) },
        secondLevel: { rows: entries.filter((r) => r.secondLevel > 0 && r.thirdLevel === 0).map(toRow) },
        thirdLevel: { rows: entries.filter((r) => r.thirdLevel > 0).map(toRow) }
    };
};

const accountToSessionData = (account, sessionKey) => ({
    sessionKey,
    firstName: account.firstName,
    middleName: account.middleName,
    lastName: account.lastName,
    username: account.username,
    email: account.email,
    department: account.department,
    departmentName: account.departmentName,
    team: account.team,
    teamName: account.teamName,
    group: account.group,
    groupName: account.groupName,
    clientType: account.clientType,
    clientTypeName: account.clientTypeName
});

export const enableDemoMode = () => {
    if (mockInstance) {
        return mockInstance;
    }

    mockInstance = new MockAdapter(axios, { delayResponse: 350 });

    mockInstance.onPost('auth/read').reply((config) => {
        const body = parseBody(config);

        const account = ACCOUNTS.find(
            (a) => a.username === body.username && a.password === body.password
        );

        if (!account) {
            return [200, { status: false, message: 'Invalid username or password. Try one of the demo accounts listed on this page.' }];
        }

        return [200, { status: true, data: accountToSessionData(account, encodeSessionKey(account.username)) }];
    });

    mockInstance.onPost('auth/destroy').reply(200, { status: true });

    mockInstance.onPost('session/read').reply((config) => {
        const body = parseBody(config);
        const username = decodeSessionKey(body.sessionKey);
        const account = ACCOUNTS.find((a) => a.username === username);

        if (!account) {
            return [200, { status: false }];
        }

        return [200, { status: true, data: accountToSessionData(account, body.sessionKey) }];
    });

    mockInstance.onPost('signup/create').reply(200, {
        status: true,
        message: 'Demo mode: request received. Nothing is actually stored — sign in with one of the demo accounts instead.'
    });

    mockInstance.onPost('navigation/agent').reply(200, {
        status: true,
        mainPanelNavigation: buildPanelNavigation('AGENT'),
        cPanelNavigation: buildPanelNavigation('CPANEL')
    });

    mockInstance.onPost('navigation/user').reply(200, {
        status: true,
        mainPanelNavigation: buildPanelNavigation('USER'),
        cPanelNavigation: {}
    });

    mockInstance.onPost('clienttype/read').reply(200, { status: true, data: CLIENT_TYPES });

    mockInstance.onPost('department/read').reply((config) => {
        const body = parseBody(config);
        const search = (body.search || '').toLowerCase();
        const data = DEPARTMENTS.filter((d) => d.departmentName.toLowerCase().includes(search));
        return [200, { status: true, data }];
    });

    mockInstance.onPost('group/client').reply((config) => {
        const body = parseBody(config);
        const search = (body.search || '').toLowerCase();
        const data = GROUPS.filter((g) => g.groupName.toLowerCase().includes(search));
        return [200, { status: true, data }];
    });

    mockInstance.onPost('user/read').reply((config) => {
        const body = parseBody(config);

        if (!clientRows) {
            clientRows = seedClients();
        }

        let rows = [...clientRows];

        if (body.search) {
            const term = body.search.toLowerCase();
            rows = rows.filter((row) =>
                Object.values(row).some((value) => String(value).toLowerCase().includes(term))
            );
        }

        if (body.sort && body.sort.column) {
            const field = CLIENT_COLUMN_TO_FIELD[body.sort.column] || body.sort.column;
            rows.sort((a, b) => {
                const av = String(a[field] ?? '');
                const bv = String(b[field] ?? '');
                return body.sort.direction === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv);
            });
        }

        const count = rows.length;
        const page = body.page || 0;
        const rowsPerPage = body.rowsPerPage || 10;
        const paged = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        return [200, { status: true, data: paged, count }];
    });

    mockInstance.onPost('user/create').reply((config) => {
        const body = parseBody(config);

        if (!clientRows) {
            clientRows = seedClients();
        }

        const departmentName = (DEPARTMENTS.find((d) => d.id === body.dpt) || {}).departmentName || '';
        const groupName = (GROUPS.find((g) => g.id === body.group) || {}).groupName || '';
        const today = new Date().toISOString().slice(0, 10);

        clientRows.unshift({
            firstName: body.firstName,
            middleName: body.middleName,
            lastName: body.lastName,
            username: body.username,
            email: body.email,
            department: departmentName,
            group: groupName,
            status: body.status === 'A' ? 'Active' : 'Disabled',
            createdAt: today,
            updatedAt: today,
            deletedAt: ''
        });

        return [200, { status: true, message: 'Client account created (demo only — resets on refresh).' }];
    });

    // Anything not explicitly mocked above (settings screens, ticket CRUD, etc.)
    // gets a harmless empty success instead of a network error, since most of
    // those views don't fetch data yet in this codebase.
    mockInstance.onAny().reply(200, { status: true, data: [], count: 0 });

    return mockInstance;
};

export default enableDemoMode;
