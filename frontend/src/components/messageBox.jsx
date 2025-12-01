const MessageBox = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
      {message}
    </div>
  );
};

export default MessageBox;
