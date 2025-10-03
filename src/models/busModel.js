import supabase from '../config/database.js';

export const busModel = {
  async getAllBuses() {
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .order('bus_number');

    if (error) throw error;
    return data;
  },

  async getActiveBuses() {
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .eq('status', 'active')
      .order('bus_number');

    if (error) throw error;
    return data;
  },

  async getBusById(id) {
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getBusByNumber(busNumber) {
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .eq('bus_number', busNumber)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createBus(busData) {
    const { data, error } = await supabase
      .from('buses')
      .insert(busData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBus(id, busData) {
    const { data, error } = await supabase
      .from('buses')
      .update(busData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBus(id) {
    const { error } = await supabase
      .from('buses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async updateBusStatus(id, status) {
    const { data, error } = await supabase
      .from('buses')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export default busModel;
