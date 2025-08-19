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

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Sidebar */}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: sidebarX }] }]}
      >
        <Text style={styles.sidebarTitle}>Conversations</Text>
        <FlatList
          data={threads}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.threadRow}>
              <TouchableOpacity
                style={styles.threadButton}
                onPress={() => setActiveThreadId(item.id)}
              >
                <Text
                  style={[
                    styles.threadText,
                    item.id === activeThreadId && styles.activeThreadText,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
              <View style={styles.threadActions}>
                <TouchableOpacity onPress={() => openEditModal(item.id)}>
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteThread(item.id)}>
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <TouchableOpacity style={styles.newThreadButton} onPress={addNewThread}>
          <Text style={styles.newThreadText}>＋ New Thread</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Chat Interface */}
      <View style={styles.chatArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={openSidebar}>
            <Text style={styles.menuButton}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{activeThread?.title}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Messages */}
        <FlatList
          data={activeThread?.messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text>{item.text}</Text>
            </View>
          )}
        />

        {/* Prompt Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Modal for Editing Thread Title */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Thread Title</Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              style={styles.modalInput}
              placeholder="New title"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelBtn}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmEditTitle}>
                <Text style={styles.confirmBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#f7f7f7',
    paddingTop: 50,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  sidebarTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  threadButton: { flex: 1 },
  threadText: { fontSize: 16 },
  activeThreadText: { fontWeight: 'bold', color: '#007AFF' },
  threadActions: { flexDirection: 'row' },
  actionIcon: { fontSize: 18, marginLeft: 8 },
  newThreadButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  newThreadText: { color: 'white', fontWeight: 'bold' },
  chatArea: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  menuButton: { fontSize: 24, paddingRight: 12 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold' },
  messageBubble: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: { color: 'white', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  cancelBtn: { marginRight: 16, color: '#888' },
  confirmBtn: { color: '#007AFF', fontWeight: 'bold' },
});
