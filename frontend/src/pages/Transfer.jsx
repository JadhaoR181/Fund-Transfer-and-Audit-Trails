import { useState, useEffect } from "react";
import { Wallet, Send, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, LogOut, TrendingUp, ChevronDown, IndianRupee } from "lucide-react";
import api from "../api/api";

export default function Transfer() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentUser, setCurrentUser] = useState(null);
  const [userMap, setUserMap] = useState({});
  const [showProfile, setShowProfile] = useState(false);

  const [view, setView] = useState("transactions");
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadDashboard = async () => {
    try {
      const [usersRes, meRes] = await Promise.all([
        api.get("/users"),
        api.get("/users/me"),
      ]);

      setUsers(usersRes.data);
      setCurrentUser(meRes.data);
      setBalance(meRes.data.balance);

      const map = {};
      usersRes.data.forEach((u) => {
        map[u.id] = u.name;
      });
      map[meRes.data.id] = "You";
      setUserMap(map);

      await loadHistory(view);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    }
  };

  const loadHistory = async (type) => {
    setHistoryLoading(true);
    try {
      const res =
        type === "transactions"
          ? await api.get("/transactions/me")
          : await api.get("/audit-logs/me");

      setTransactions(res.data);
    } catch (err) {
      setError("Failed to load history", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadHistory(view);
  }, [view]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      await api.post("/transfer/", {
        receiver_id: Number(receiverId),
        amount: Number(amount),
      });

      setSuccessMessage("Transfer successful!");
      setReceiverId("");
      setAmount("");
      await loadDashboard();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const selectedUser = users.find(u => u.id === Number(receiverId));

  const sentAmount = transactions
    .filter(tx => tx.sender_id === currentUser?.id)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const receivedAmount = transactions
    .filter(tx => tx.receiver_id === currentUser?.id)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Compact Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg">
                <Wallet className="text-white w-5 h-5" />
              </div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LenDenClub
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium text-gray-900">{currentUser.name}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 top-11 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-56">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{currentUser.name}</p>
                          <p className="text-xs text-gray-500">{currentUser.email}</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-gray-500">Balance</p>
                        <p className="text-xl font-bold text-gray-900">₹{balance.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Compact Balance Bar */}
        <div className="bg-gradient-to-r from-indigo-500/90 to-violet-500/90 rounded-lg px-5 py-3 text-white shadow-sm mb-4">
  <div className="flex items-center justify-between">
    
    {/* Balance */}
    <div>
      <p className="text-xs opacity-80">Available Balance</p>
      <h2 className="text-2xl font-semibold leading-tight">
        ₹{balance.toLocaleString("en-IN")}
      </h2>
    </div>

    {/* Stats */}
    <div className="flex gap-3 text-right">
      <div className="bg-white/20 rounded-md px-3 py-1.5 min-w-[90px]">
        <div className="flex items-center justify-end gap-1 text-xs opacity-80">
          <ArrowDownLeft className="w-3 h-3" />
          Received
        </div>
        <p className="text-sm font-medium">
          ₹{receivedAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}
        </p>
      </div>

      <div className="bg-white/20 rounded-md px-3 py-1.5 min-w-[90px]">
        <div className="flex items-center justify-end gap-1 text-xs opacity-80">
          <ArrowUpRight className="w-3 h-3" />
          Sent
        </div>
        <p className="text-sm font-medium">
          ₹{sentAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}
        </p>
      </div>
    </div>

  </div>
</div>


        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Transfer Form - Compact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">Send Money</h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Recipient
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white pr-8"
                      value={receiverId}
                      onChange={(e) => setReceiverId(e.target.value)}
                    >
                      <option value="">Choose recipient...</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} - {u.email}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                  {selectedUser && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{selectedUser.name}</p>
                        <p className="text-xs text-gray-500">{selectedUser.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-semibold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{successMessage}</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleTransfer}
                  disabled={loading || !receiverId || !amount}
                  className="w-full bg-gradient-to-r from-indigo-500/90 to-violet-500/90 text-white py-2.5 text-sm rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Money
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Transaction History - Compact */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">Transaction History</h3>
                  </div>

                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg shadow-sm">
                    <button
                      onClick={() => setView("transactions")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                        view === "transactions"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Transactions
                    </button>
                    <button
                      onClick={() => setView("audit")}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                        view === "audit"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Audit Logs
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">From</th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-700">To</th>
                        <th className="text-right py-2 px-3 text-xs font-semibold text-gray-700">Amount</th>
                        <th className="text-center py-2 px-3 text-xs font-semibold text-gray-700">Status</th>
                        <th className="text-right py-2 px-3 text-xs font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {historyLoading ? (
                        <tr>
                          <td colSpan="5" className="px-3 py-8 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              Loading...
                            </div>
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-3 py-8 text-center text-gray-500 text-xs">
                            {view === "transactions" ? "No transactions yet" : "No audit logs available"}
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => {
                          const isSender = tx.sender_id === currentUser?.id;

                          return (
                            <tr key={tx.id} className="hover:bg-gray-50 transition">
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/90 to-violet-500/90 text-white flex items-center justify-center text-xs font-semibold">
                                    {(isSender ? "You" : userMap[tx.sender_id] || "User").charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900 text-xs">
                                    {isSender ? "You" : userMap[tx.sender_id] || "User"}
                                  </span>
                                </div>
                              </td>

                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/90 to-pink-500/90 text-white flex items-center justify-center text-xs font-semibold">
                                    {(isSender ? userMap[tx.receiver_id] || "User" : "You").charAt(0)}
                                  </div>
                                  <span className="font-medium text-gray-900 text-xs">
                                    {isSender ? userMap[tx.receiver_id] || "User" : "You"}
                                  </span>
                                </div>
                              </td>

                              <td className="px-3 py-2.5 text-right">
                                <span className={`font-bold text-xs ${isSender ? "text-red-600" : "text-green-600"}`}>
                                  {isSender ? "-" : "+"}₹{Number(tx.amount).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </td>

                              <td className="px-3 py-2.5 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  <CheckCircle className="w-3 h-3" />
                                  {tx.status}
                                </span>
                              </td>

                              <td className="px-3 py-2.5 text-right">
                                <span className="text-xs text-gray-500">
                                  {new Date(tx.timestamp || tx.created_at).toLocaleDateString()}
                                </span>
                                <br />
                                <span className="text-xs text-gray-400">
                                  {new Date(tx.timestamp || tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
