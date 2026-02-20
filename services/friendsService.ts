import { PublicUser, FriendRequest, Friendship, User } from '../types';
import { authService } from './authService';

const FRIEND_REQUESTS_KEY = 'eznannya_friend_requests';
const FRIENDSHIPS_KEY = 'eznannya_friendships';
const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

// Helper to check if a user is online based on lastActiveTimestamp
const isUserOnline = (user: User): boolean => {
  if (!user.lastActiveTimestamp) return false;
  return (Date.now() - user.lastActiveTimestamp) < ONLINE_THRESHOLD_MS;
};

// Helper to format last seen time
const formatLastSeen = (timestamp?: number): string => {
  if (!timestamp) return 'Давно';
  const diff = Date.now() - timestamp;
  if (diff < ONLINE_THRESHOLD_MS) return 'Онлайн';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} хв тому`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} год тому`;
  return 'Давно';
};

// Helper to convert internal User to PublicUser
const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  username: user.username,
  grade: user.grade,
  level: user.level,
  xp: user.xp,
  avatar: user.avatar,
  isOnline: isUserOnline(user),
  lastSeen: formatLastSeen(user.lastActiveTimestamp)
});

export const friendsService = {
  getFriends: (): PublicUser[] => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return [];
    
    // 1. Get all friendships
    const friendshipsJson = localStorage.getItem(FRIENDSHIPS_KEY);
    const friendships: Friendship[] = friendshipsJson ? JSON.parse(friendshipsJson) : [];

    // 2. Filter for current user
    const userFriendships = friendships.filter(f => f.user1Id === currentUser.id || f.user2Id === currentUser.id);

    // 3. Extract friend IDs
    const friendIds = userFriendships.map(f => f.user1Id === currentUser.id ? f.user2Id : f.user1Id);

    // 4. Resolve users from DB
    const allUsers = authService.getUsers();
    const friends = allUsers
      .filter(u => friendIds.includes(u.id))
      .map(toPublicUser);

    return friends;
  },

  getOnlineCount: (): number => {
    const friends = friendsService.getFriends();
    return friends.filter(f => f.isOnline).length;
  },

  searchUsers: (query: string): PublicUser[] => {
    if (!query.trim()) return [];
    const currentUser = authService.getCurrentUser();
    const allUsers = authService.getUsers();

    return allUsers
      .filter(u => 
        u.id !== currentUser?.id && 
        u.username.toLowerCase().includes(query.toLowerCase())
      )
      .map(toPublicUser)
      .slice(0, 10); // Limit results
  },

  getRequests: (): FriendRequest[] => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return [];

    const allRequestsJson = localStorage.getItem(FRIEND_REQUESTS_KEY);
    const allRequests: FriendRequest[] = allRequestsJson ? JSON.parse(allRequestsJson) : [];

    // Return pending requests where current user is receiver
    return allRequests.filter(r => r.receiverId === currentUser.id && r.status === 'pending');
  },

  sendRequest: (toUser: PublicUser) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const allRequestsJson = localStorage.getItem(FRIEND_REQUESTS_KEY);
    let allRequests: FriendRequest[] = allRequestsJson ? JSON.parse(allRequestsJson) : [];

    // Check if request already exists (pending)
    const exists = allRequests.some(r => 
      r.senderId === currentUser.id && 
      r.receiverId === toUser.id && 
      r.status === 'pending'
    );
    if (exists) return;

    // Check if they are already friends
    const friendshipsJson = localStorage.getItem(FRIENDSHIPS_KEY);
    const friendships: Friendship[] = friendshipsJson ? JSON.parse(friendshipsJson) : [];
    const areFriends = friendships.some(f => 
      (f.user1Id === currentUser.id && f.user2Id === toUser.id) ||
      (f.user1Id === toUser.id && f.user2Id === currentUser.id)
    );
    if (areFriends) return;

    const senderProfile = toPublicUser(currentUser);

    const newReq: FriendRequest = {
      id: `req-${Date.now()}-${Math.random()}`,
      senderId: currentUser.id,
      sender: senderProfile,
      receiverId: toUser.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    allRequests.push(newReq);
    localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(allRequests));
  },

  acceptRequest: (requestId: string) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const allRequestsJson = localStorage.getItem(FRIEND_REQUESTS_KEY);
    let allRequests: FriendRequest[] = allRequestsJson ? JSON.parse(allRequestsJson) : [];
    
    const reqIndex = allRequests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return;

    const request = allRequests[reqIndex];
    
    // Create friendship record
    const friendshipsJson = localStorage.getItem(FRIENDSHIPS_KEY);
    const friendships: Friendship[] = friendshipsJson ? JSON.parse(friendshipsJson) : [];

    const newFriendship: Friendship = {
      id: `fr-${Date.now()}`,
      user1Id: request.senderId,
      user2Id: request.receiverId,
      createdAt: new Date().toISOString()
    };

    friendships.push(newFriendship);
    localStorage.setItem(FRIENDSHIPS_KEY, JSON.stringify(friendships));

    // Remove request (or mark accepted)
    allRequests = allRequests.filter(r => r.id !== requestId);
    localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(allRequests));
  },

  declineRequest: (requestId: string) => {
    const allRequestsJson = localStorage.getItem(FRIEND_REQUESTS_KEY);
    let allRequests: FriendRequest[] = allRequestsJson ? JSON.parse(allRequestsJson) : [];
    allRequests = allRequests.filter(r => r.id !== requestId);
    localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(allRequests));
  },
  
  removeFriend: (friendId: string) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;
    
    const friendshipsJson = localStorage.getItem(FRIENDSHIPS_KEY);
    let friendships: Friendship[] = friendshipsJson ? JSON.parse(friendshipsJson) : [];

    // Remove friendship where current user matches either side and friend matches other
    friendships = friendships.filter(f => 
      !((f.user1Id === currentUser.id && f.user2Id === friendId) || 
        (f.user1Id === friendId && f.user2Id === currentUser.id))
    );
    
    localStorage.setItem(FRIENDSHIPS_KEY, JSON.stringify(friendships));
  }
};