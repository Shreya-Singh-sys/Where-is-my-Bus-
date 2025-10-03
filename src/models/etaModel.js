import supabase from '../config/database.js';

export const etaModel = {
  async getETAForBusAtStop(busId, stopId) {
    const { data, error } = await supabase
      .from('eta_calculations')
      .select('*')
      .eq('bus_id', busId)
      .eq('stop_id', stopId)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllETAsForBus(busId) {
    const { data, error } = await supabase
      .from('eta_calculations')
      .select(`
        *,
        stops (*)
      `)
      .eq('bus_id', busId)
      .order('distance_to_stop_km');

    if (error) throw error;
    return data;
  },

  async getAllETAsForStop(stopId) {
    const { data, error } = await supabase
      .from('eta_calculations')
      .select(`
        *,
        buses (*)
      `)
      .eq('stop_id', stopId)
      .order('estimated_arrival_time');

    if (error) throw error;
    return data;
  },

  async insertETA(etaData) {
    const { data, error } = await supabase
      .from('eta_calculations')
      .insert(etaData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async insertBulkETAs(etaDataArray) {
    const { data, error } = await supabase
      .from('eta_calculations')
      .insert(etaDataArray)
      .select();

    if (error) throw error;
    return data;
  },

  async deleteOldETAs(busId) {
    const { error } = await supabase
      .from('eta_calculations')
      .delete()
      .eq('bus_id', busId);

    if (error) throw error;
    return true;
  },

  async cleanupOldETAs(olderThanMinutes = 60) {
    const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('eta_calculations')
      .delete()
      .lt('calculated_at', cutoffTime);

    if (error) throw error;
    return true;
  }
};

export default etaModel;
