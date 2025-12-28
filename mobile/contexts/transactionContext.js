import React, { createContext, useContext, useState } from 'react';
import { transactionsService } from '../services/transactionService';
import { useUser } from './userContext'; // assuming you have a UserContext providing the token

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const { token } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionsService.getMyTransactions(token);
      setTransactions(data.data);
      return data.data;
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      return { error: "There is an error loading your transactions" };
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTransactionSummary = async () => {
    setLoading(true);
    try {
      const data = await transactionsService.getMyTransactionSummary(token);
      setSummary(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch transaction summary:", err);
      return { error: "There is an error loading transaction summary" };
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionById = async (id) => {
    try {
      return await transactionsService.getTransactionById(token, id);
    } catch (err) {
      console.error("Failed to fetch transaction:", err);
      return { error: "There is an error loading the transaction" };
    }
  };

  const fetchMySalesTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionsService.getMySalesTransactions(token);
      setSales(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      return { error: "There is an error loading sales transactions" };
    } finally {
      setLoading(false);
    }
  };

  const purchasePack = async (packId, paymentMethod = 'card') => {
    setLoading(true);
    try {
      const data = await transactionsService.purchaseJetonPack(token, { 
        packId, 
        paymentMethod 
      });
      return { success: true, data };
    } catch (err) {
      console.error("Failed to purchase pack:", err);
      return { success: false, error: err.response?.data?.message || "There is an error purchasing the pack" };
    } finally {
      setLoading(false);
    }
  };

  const payBooking = async ({ bookingId, paymentMethod, jetonsToUse = 0 }) => {
    setLoading(true);
    try {
      const data = await transactionsService.payBooking(token, {
        bookingId,
        paymentMethod,
        jetonsToUse,
      });
      return { success: true, data };
    } catch (err) {
      console.error("Failed to pay booking:", err);
      return { success: false, error: "There is an error processing the payment" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        sales,
        loading,
        fetchMyTransactions,
        fetchMyTransactionSummary,
        fetchTransactionById,
        fetchMySalesTransactions,
        purchasePack,
        payBooking
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);
