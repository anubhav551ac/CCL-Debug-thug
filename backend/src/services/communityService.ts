import prisma from "../utils/prisma.js";

export const getCommunityUpdates = async () => {
    // 1. Fetch latest 5 Pledges
    const pledges = await prisma.pledge.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, profilePic: true } },
            wastePin: { select: { municipality: true } }
        }
    });

    // 2. Fetch latest 5 CleanupProofs
    const cleanups = await prisma.cleanupProof.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            cleaner: { select: { name: true, profilePic: true } },
            wastePin: { select: { municipality: true } }
        }
    });

    // 3. Fetch latest 5 Reports (WastePins)
    const reports = await prisma.wastePin.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            reporter: { select: { name: true, profilePic: true } }
        }
    });

    // Format them for the feed
    const formattedPledges = pledges.map(p => ({
        id: p.id,
        type: 'pledge',
        user: p.user.name,
        userPic: p.user.profilePic,
        action: `pledged Rs. ${p.amount}`,
        location: p.wastePin.municipality,
        createdAt: p.createdAt
    }));

    const formattedCleanups = cleanups.map(c => ({
        id: c.id,
        type: 'cleanup',
        user: c.cleaner.name,
        userPic: c.cleaner.profilePic,
        action: 'cleared a bounty',
        location: c.wastePin.municipality,
        createdAt: c.createdAt
    }));

    const formattedReports = reports.map(r => ({
        id: r.id,
        type: 'report',
        user: r.reporter.name,
        userPic: r.reporter.profilePic,
        action: 'reported a new dump',
        location: r.municipality,
        createdAt: r.createdAt
    }));

    // Mock high-value actions
    const mockActions = [
        { id: 'mock-1', type: 'pledge', user: 'Civic Fund', action: 'pledged Rs. 500', location: 'Metropolis', createdAt: new Date() },
        { id: 'mock-2', type: 'cleanup', user: 'Green Team', action: 'cleared a bounty', location: 'Lazimpat', createdAt: new Date() }
    ];

    // Merge and sort
    const allUpdates = [...formattedPledges, ...formattedCleanups, ...formattedReports, ...mockActions]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

    return allUpdates;
};
