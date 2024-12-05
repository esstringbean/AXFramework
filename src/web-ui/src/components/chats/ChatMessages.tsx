import { FileList } from '@/components/FileList.js';
import { Prose } from '@/components/Prose.js';
import { AgentHoverCard } from '@/components/agents/AgentHoverCard.js';
import { useCurrentUser } from '@/components/hooks/useUser.js';
import { Alert, AlertDescription } from '@/components/ui/alert.js';
import { UserHoverCard } from '@/components/users/UserHoverCard.js';
import { GetUserRes } from '@/types/users.js';
import { AlertCircle, Circle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CopyBlock, nord } from 'react-code-blocks';

import type { Message } from './types.js';

import { Toolbar } from './ChatMessageToolbar.js';
import { useMessagesById, useMessagesValue } from './useMessages.js';

interface ChatMessagesProps {
  chatId: string;
  isDone?: boolean;
}

export const ChatMessages = ({ chatId }: ChatMessagesProps) => {
  const { user } = useCurrentUser();

  const messages = useMessagesValue(chatId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto">
      <div className="overflow-y-auto mt-2">
        {messages?.map((m) => (
          <Message
            chatId={chatId}
            isDone={false}
            key={m.id as unknown as string}
            message={m}
            user={user}
          />
        ))}
      </div>
      <div className="h-5" ref={messagesEndRef} />
    </div>
  );
};

interface ChatMessagesEmptyProps {
  messageIds?: string[];
}

export const ChatMessagesEmpty = ({ messageIds }: ChatMessagesEmptyProps) => {
  const { messages } = useMessagesById(messageIds);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="flex-grow overflow-y-auto">
      <div className="overflow-y-auto mt-2">
        {messages?.map((m) => (
          <Message key={m.id as unknown as string} message={m} />
        ))}
        <div className="h-5" ref={messagesEndRef} />
      </div>
    </div>
  );
};

interface MessageProps {
  chatId?: string;
  isDone?: boolean;
  message: Message;
  user?: GetUserRes;
}

const Message = ({ chatId, isDone, message, user }: Readonly<MessageProps>) => {
  return (
    <div className="opacity-0 opacity-100 transition-opacity duration-800 ease-in-out">
      <div
        className="flex gap-3 px-4 py-1 hover:bg-primary/[2%]"
        key={message.id as unknown as string}
      >
        <div>
          {message.agent ? (
            <AgentHoverCard agent={message.agent} size="xl" />
          ) : (
            <UserHoverCard user={message.user} />
          )}
        </div>

        <div className="flex flex-col justify-between w-full group">
          <div className="text-lg w-full">
            {message.processing ? (
              <TypingIndicator />
            ) : (
              <ResponseContent message={message} />
            )}
          </div>

          {chatId && !isDone && (
            <Toolbar chatId={chatId} message={message} user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

type ResponseContentProps = Omit<MessageProps, 'chatId'>;

const ResponseContent = ({ message }: Readonly<ResponseContentProps>) => {
  let content: React.ReactNode;

  if (message.error) {
    content = <ErrorMessage error={message.error} />;
  } else if (message.blocks) {
    content = message.blocks?.map((block, index) => {
      if (block.type === 'code' && block.text) {
        return (
          <CopyBlock
            codeBlock={true}
            key={index}
            language={block.lang ?? 'text'}
            showLineNumbers={false}
            text={block.text}
            theme={nord}
            wrapLongLines={true}
          />
        );
      } else if (block.content) {
        return (
          <Prose key={index}>
            <div dangerouslySetInnerHTML={{ __html: block.content }} />
          </Prose>
        );
      }
      return null;
    });
  } else {
    return <div className="text-gray-600">{message.text}</div>;
  }

  return (
    <>
      <div className="space-y-2 w-full overflow-hidden text-gray-600">
        {content}
        {!message.error && message.files && (
          <MessageAttachments message={message} />
        )}
      </div>
    </>
  );
};

const MessageAttachments = ({ message }: ResponseContentProps) => {
  const images = message.files?.filter((f) => f.type.startsWith('image'));
  const others = message.files?.filter((f) => !f.type.startsWith('image'));

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {images?.map((file) => (
          <div key={file.id}>
            <img
              alt={file.name}
              className="object-cover rounded-lg"
              src={`/api/a/messages/${message.id}/files/${file.id}`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {others?.map((file) => (
          <div key={file.id}>
            <FileList files={[file]} />
          </div>
        ))}
      </div>
    </>
  );
};

const TypingIndicator = () => (
  <div>
    <div className="flex items-center space-x-2 rounded-full py-2 w-20">
      <Circle className="w-3 h-3 animate-bounce" />
      <Circle
        className="w-3 h-3 animate-bounce"
        style={{ animationDelay: '0.2s' }}
      />
      <Circle
        className="w-3 h-3 animate-bounce"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  </div>
);

const ErrorMessage = ({ error }: { error: string }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Alert className="max-w-md" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="w-full">
        <div className="flex items-center justify-between">
          <span>An error occurred.</span>
          <button
            className="text-xs underline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide details' : 'View details'}
          </button>
        </div>
        {showDetails && (
          <p className="mt-2 text-sm break-words">{error || 'Unknown error'}</p>
        )}
      </AlertDescription>
    </Alert>
  );
};
