import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75;

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
};

type Thread = {
  id: string;
  title: string;
  messages: Message[];
};

const HomeScreen: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([
    { id: '1', title: 'General', messages: [] },
    { id: '2', title: 'Ideas', messages: [] },
  ]);
  const [activeThreadId, setActiveThreadId] = useState('1');
  const [inputText, setInputText] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [darkMode, setDarkMode] = useState(false); // 🌙 Dark mode toggle

  const sidebarX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const activeThread = threads.find(t => t.id === activeThreadId);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dx > 20 && gesture.moveX < 50,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 50) openSidebar();
      },
    })
  ).current;

  const openSidebar = () => {
    Animated.timing(sidebarX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarX, {
      toValue: -SIDEBAR_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    closeSidebar();
  }, [activeThreadId]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
    };

    const updatedMessages = [...(activeThread?.messages ?? []), userMessage];

    setThreads(prev =>
      prev.map(thread =>
        thread.id === activeThreadId
          ? { ...thread, messages: updatedMessages }
          : thread
      )
    );

    setInputText('');

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Simulated AI response.',
        sender: 'ai',
      };

      setThreads(prev =>
        prev.map(thread =>
          thread.id === activeThreadId
            ? { ...thread, messages: [...updatedMessages, aiMessage] }
            : thread
        )
      );
    }, 600);
  };

  const handleDeleteThread = (id: string) => {
    const thread = threads.find(t => t.id === id);
    Alert.alert(
      'Delete Thread',
      `Are you sure you want to delete "${thread?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const filtered = threads.filter(t => t.id !== id);
            setThreads(filtered);
            if (id === activeThreadId && filtered.length > 0) {
              setActiveThreadId(filtered[0].id);
            }
          },
        },
      ]
    );
  };

  const openEditModal = (id: string) => {
    const thread = threads.find(t => t.id === id);
    if (!thread) return;
    setEditingThreadId(id);
    setNewTitle(thread.title);
    setEditModalVisible(true);
  };

  const confirmEditTitle = () => {
    if (!newTitle.trim()) return;
    setThreads(prev =>
      prev.map(thread =>
        thread.id === editingThreadId
          ? { ...thread, title: newTitle.trim() }
          : thread
      )
    );
    setEditModalVisible(false);
    setEditingThreadId(null);
    setNewTitle('');
  };

  const addNewThread = () => {
    const id = Date.now().toString();
    const newThread: Thread = {
      id,
      title: 'New Thread',
      messages: [],
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(id);
  };

  const theme = darkMode ? dark : light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} {...panResponder.panHandlers}>
      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: theme.sidebarBackground,
            transform: [{ translateX: sidebarX }],
          },
        ]}
      >
        <Text style={[styles.sidebarTitle, { color: theme.text }]}>Conversations</Text>
        <FlatList
          data={threads}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.threadRow}>
              <TouchableOpacity
                style={styles.threadButton}
                onPress={() => {
                  if (activeThreadId !== item.id) {
                    setActiveThreadId(item.id);
                  }
                  closeSidebar();
                }}
              >
                <Text
                  style={[
                    styles.threadText,
                    { color: theme.text },
                    item.id === activeThreadId && { color: theme.accent, fontWeight: 'bold' },
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
              <View style={styles.threadActions}>
                <TouchableOpacity onPress={() => openEditModal(item.id)}>
                  <Text style={[styles.actionIcon, { color: theme.icon }]}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteThread(item.id)}>
                  <Text style={[styles.actionIcon, { color: theme.icon }]}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={[styles.newThreadButton, { backgroundColor: theme.accent }]}
          onPress={addNewThread}
        >
          <Text style={styles.newThreadText}>＋ New Thread</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Chat Interface */}
      <View style={[styles.chatArea, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
          <TouchableOpacity onPress={openSidebar}>
            <Text style={[styles.menuButton, { color: theme.accent }]}>☰</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{activeThread?.title}</Text>
          <TouchableOpacity onPress={() => setDarkMode(prev => !prev)}>
            <Text style={{ fontSize: 20 }}>{darkMode ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          data={activeThread?.messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user'
                  ? { backgroundColor: theme.userBubble, alignSelf: 'flex-end' }
                  : { backgroundColor: theme.aiBubble, alignSelf: 'flex-start' },
              ]}
            >
              <Text style={{ color: theme.text }}>{item.text}</Text>
            </View>
          )}
        />

        {/* Prompt Bar */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBox,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={darkMode ? '#888' : '#999'}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={[styles.sendButton, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { backgroundColor: theme.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Thread Title</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.inputBox,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="New title"
              placeholderTextColor={darkMode ? '#888' : '#999'}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={[styles.cancelBtn, { color: theme.subtle }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmEditTitle}>
                <Text style={[styles.confirmBtn, { color: theme.accent }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const light = {
  background: '#F2F4F7',
  sidebarBackground: '#FFFFFF',
  headerBackground: '#FFFFFF',
  inputBackground: '#FFFFFF',
  inputBox: '#F9FAFB',
  modalBackground: '#FFFFFF',
  text: '#1A1A1A',
  icon: '#333',
  subtle: '#6B7280',
  border: '#D1D5DB',
  userBubble: '#007AFF',
  aiBubble: '#E5E7EB',
  accent: '#007AFF',
};

const dark = {
  background: '#1C1C1E',
  sidebarBackground: '#2C2C2E',
  headerBackground: '#2C2C2E',
  inputBackground: '#2C2C2E',
  inputBox: '#3A3A3C',
  modalBackground: '#2C2C2E',
  text: '#FFFFFF',
  icon: '#DDDDDD',
  subtle: '#A1A1AA',
  border: '#3F3F46',
  userBubble: '#0A84FF',
  aiBubble: '#3A3A3C',
  accent: '#0A84FF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F4F7',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  threadButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  threadText: {
    fontSize: 16,
    color: '#333',
  },
  activeThreadText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  threadActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionIcon: {
    fontSize: 18,
    marginLeft: 8,
    opacity: 0.7,
  },
  newThreadButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  newThreadText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuButton: {
    fontSize: 24,
    paddingRight: 16,
    color: '#007AFF',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  messageBubble: {
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 16,
    maxWidth: '75%',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    marginRight: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  confirmBtn: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

