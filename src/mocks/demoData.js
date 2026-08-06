// Static demo data used only when REACT_APP_DEMO_MODE=true.
// None of this touches a real database — it's all in-memory / hardcoded,
// purely so a GitHub Pages demo has something to click through.

export const ACCOUNTS = [
    {
        username: 'demo.user',
        password: 'demo1234',
        firstName: 'Alex',
        middleName: 'Q',
        lastName: 'Santos',
        email: 'demo.user@example.com',
        department: 1,
        departmentName: 'IT Support',
        team: 0,
        teamName: null,
        group: 1,
        groupName: 'Tier 1 Support',
        clientType: 1,
        clientTypeName: 'user'
    },
    {
        username: 'demo.agent',
        password: 'demo1234',
        firstName: 'Jordan',
        middleName: 'M',
        lastName: 'Cruz',
        email: 'demo.agent@example.com',
        department: 1,
        departmentName: 'IT Support',
        team: 0,
        teamName: null,
        group: 1,
        groupName: 'Tier 1 Support',
        clientType: 0,
        clientTypeName: 'agent'
    },
    {
        username: 'demo.admin',
        password: 'demo1234',
        firstName: 'Riley',
        middleName: 'P',
        lastName: 'Dela Cruz',
        email: 'demo.admin@example.com',
        department: 1,
        departmentName: 'IT Support',
        team: 0,
        teamName: null,
        group: 3,
        groupName: 'System Administrators',
        clientType: 2,
        clientTypeName: 'agent'
    }
];

export const DEPARTMENTS = [
    { id: 1, departmentName: 'IT Support' },
    { id: 2, departmentName: 'Human Resources' },
    { id: 3, departmentName: 'Finance' }
];

export const GROUPS = [
    { id: 1, groupName: 'Tier 1 Support' },
    { id: 2, groupName: 'Tier 2 Support' },
    { id: 3, groupName: 'System Administrators' }
];

export const CLIENT_TYPES = [
    { id: 1, clientTypeName: 'User' },
    { id: 0, clientTypeName: 'Agent' }
];

const FIRST_NAMES = ['Maria', 'Jose', 'Ana', 'Carlos', 'Liza', 'Ramon', 'Grace', 'Paolo', 'Nicole', 'Miguel', 'Bianca', 'Enzo', 'Kristine', 'Diego'];
const LAST_NAMES = ['Reyes', 'Garcia', 'Torres', 'Flores', 'Ramos', 'Bautista', 'Aquino', 'Villanueva', 'Mendoza', 'Castro', 'Salazar', 'Navarro', 'Gonzales', 'Rivera'];

export const seedClients = () =>
    FIRST_NAMES.map((firstName, i) => {
        const lastName = LAST_NAMES[i];
        const username = (firstName[0] + lastName).toLowerCase();
        const dept = DEPARTMENTS[i % DEPARTMENTS.length];
        const group = GROUPS[i % GROUPS.length];
        const status = i % 4 === 0 ? 'Disabled' : 'Active';
        const day = String((i % 27) + 1).padStart(2, '0');

        return {
            firstName,
            middleName: String.fromCharCode(65 + (i % 26)),
            lastName,
            username,
            email: `${username}@example.com`,
            department: dept.departmentName,
            group: group.groupName,
            status,
            createdAt: `2026-0${(i % 6) + 1}-${day}`,
            updatedAt: `2026-0${((i + 1) % 6) + 1}-${day}`,
            deletedAt: status === 'Disabled' ? `2026-0${((i + 2) % 6) + 1}-${day}` : ''
        };
    });

// Maps the uppercase column headers DataTableUI sorts by (Client.js) back
// to the actual object field names.
export const CLIENT_COLUMN_TO_FIELD = {
    FIRSTNAME: 'firstName',
    MIDDLENAME: 'middleName',
    LASTNAME: 'lastName',
    USERNAME: 'username',
    EMAIL: 'email',
    DEPARTMENT: 'department',
    GROUP: 'group',
    STATUS: 'status',
    'CREATE DATE': 'createdAt',
    'LAST UPDATE DATE': 'updatedAt',
    'DISABLE DATE': 'deletedAt'
};
