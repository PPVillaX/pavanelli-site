import { getContacts } from '@/lib/queries';
import MessagesClient from './messages-client';

export default async function AdminMessagesPage() {
  const contacts = await getContacts();
  return <MessagesClient contacts={contacts} />;
}
