import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  drivers: [],
  deletedDrivers: [],
  driver: null,
  stats: null,
  loading: false,
  error: null,
  message: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  deletedPagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

export const getDrivers = createAsyncThunk(
  "drivers/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/drivers", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch drivers.",
      );
    }
  },
);

export const getDeletedDrivers = createAsyncThunk(
  "drivers/getDeleted",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/drivers", {
        params: { ...params, showDeleted: "true" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch deleted drivers.",
      );
    }
  },
);

export const getDriver = createAsyncThunk(
  "drivers/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/drivers/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch driver.",
      );
    }
  },
);

export const getDriverStats = createAsyncThunk(
  "drivers/getStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/drivers/stats");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch driver stats.",
      );
    }
  },
);

export const updateDriver = createAsyncThunk(
  "drivers/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/drivers/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update driver.",
      );
    }
  },
);

export const deleteDriver = createAsyncThunk(
  "drivers/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/drivers/${id}`);
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete driver.",
      );
    }
  },
);

export const restoreDriver = createAsyncThunk(
  "drivers/restore",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/drivers/${id}/restore`);
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to restore driver.",
      );
    }
  },
);

export const permanentDeleteDriver = createAsyncThunk(
  "drivers/permanentDelete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/drivers/${id}/permanent`);
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to permanently delete driver.",
      );
    }
  },
);

export const toggleDriverStatus = createAsyncThunk(
  "drivers/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/drivers/${id}/toggle-status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update driver status.",
      );
    }
  },
);

export const approveDriver = createAsyncThunk(
  "drivers/approve",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/drivers/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve driver.",
      );
    }
  },
);

export const rejectDriver = createAsyncThunk(
  "drivers/reject",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/drivers/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject driver.",
      );
    }
  },
);

export const approveDocument = createAsyncThunk(
  "drivers/approveDocument",
  async ({ id, docType }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/drivers/${id}/documents/${docType}/approve`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve document.",
      );
    }
  },
);

export const rejectDocument = createAsyncThunk(
  "drivers/rejectDocument",
  async ({ id, docType, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/drivers/${id}/documents/${docType}/reject`,
        { reason },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject document.",
      );
    }
  },
);

export const approveVehicleDocument = createAsyncThunk(
  "drivers/approveVehicleDocument",
  async ({ id, vehicleId, docType }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/drivers/${id}/vehicles/${vehicleId}/documents/${docType}/approve`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve vehicle document.",
      );
    }
  },
);

export const rejectVehicleDocument = createAsyncThunk(
  "drivers/rejectVehicleDocument",
  async ({ id, vehicleId, docType, reason }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/drivers/${id}/vehicles/${vehicleId}/documents/${docType}/reject`,
        { reason },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject vehicle document.",
      );
    }
  },
);

const driverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearDriver: (state) => {
      state.driver = null;
    },
  },
  extraReducers: (builder) => {
    const replaceInList = (state, payload) => {
      const updated = payload?.data;
      if (!updated) return;
      const idx = state.drivers.findIndex((d) => d._id === updated._id);
      if (idx !== -1) state.drivers[idx] = updated;
      if (state.driver && state.driver._id === updated._id) {
        state.driver = updated;
      }
    };

    builder
      .addCase(getDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.data || [];
        state.stats = action.payload.stats || state.stats;
        if (action.payload.pagination)
          state.pagination = action.payload.pagination;
      })
      .addCase(getDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDeletedDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeletedDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedDrivers = action.payload.data || [];
        if (action.payload.pagination)
          state.deletedPagination = action.payload.pagination;
      })
      .addCase(getDeletedDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload.data;
      })
      .addCase(getDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDriverStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      })

      .addCase(updateDriver.fulfilled, (state, action) => {
        replaceInList(state, action.payload);
        state.message =
          action.payload.message || "Driver updated successfully.";
      })

      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter(
          (d) => d._id !== action.payload.id,
        );
        state.message =
          action.payload.message || "Driver deleted successfully.";
      })

      .addCase(restoreDriver.fulfilled, (state, action) => {
        state.deletedDrivers = state.deletedDrivers.filter(
          (d) => d._id !== action.payload.id,
        );
        state.message =
          action.payload.message || "Driver restored successfully.";
      })

      .addCase(permanentDeleteDriver.fulfilled, (state, action) => {
        state.deletedDrivers = state.deletedDrivers.filter(
          (d) => d._id !== action.payload.id,
        );
        state.message =
          action.payload.message ||
          "Driver permanently deleted successfully.";
      })

      .addCase(toggleDriverStatus.fulfilled, (state, action) => {
        replaceInList(state, action.payload);
        state.message =
          action.payload.message || "Driver status updated successfully.";
      })

      .addCase(approveDriver.fulfilled, (state, action) => {
        replaceInList(state, action.payload);
        state.message =
          action.payload.message || "Driver approved successfully.";
      })
      .addCase(rejectDriver.fulfilled, (state, action) => {
        replaceInList(state, action.payload);
        state.message = action.payload.message || "Driver rejected.";
      })
      .addCase(approveDocument.fulfilled, (state, action) => {
        replaceInList(state, action.payload);
        state.message = action.payload.message || "Document approved.";
      })
      .addCase(rejectDocument.fulfilled, (state, action) => {
        replaceInList(state, action.payload);
        state.message = action.payload.message || "Document rejected.";
      })
      .addCase(approveVehicleDocument.fulfilled, (state, action) => {
        replaceInList(state, action.payload);
        state.message =
          action.payload.message || "Vehicle document approved.";
      })
      .addCase(rejectVehicleDocument.fulfilled, (state, action) => {
        replaceInList(state, action.payload);
        state.message =
          action.payload.message || "Vehicle document rejected.";
      });
  },
});

export const { clearError, clearMessage, clearDriver } = driverSlice.actions;
export default driverSlice.reducer;
