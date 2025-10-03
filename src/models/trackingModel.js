import supabase from '../config/database.js';

export const trackingModel = {
  async getBusLocation(busId) {
    const { data, error } = await supabase
      .from('bus_locations')
      .select('*')
      .eq('bus_id', busId)
      .order('gps_timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async insertBusLocation(locationData) {
    const { data, error } = await supabase
      .from('bus_locations')
      .insert(locationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBusLocationHistory(busId, limit = 100) {
    const { data, error } = await supabase
      .from('bus_locations')
      .select('*')
      .eq('bus_id', busId)
      .order('gps_timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getCurrentTracking(busId) {
    const { data, error } = await supabase
      .from('bus_tracking')
      .select(`
        *,
        buses (*),
        routes (*),
        current_stop:stops!bus_tracking_current_stop_id_fkey (*),
        next_stop:stops!bus_tracking_next_stop_id_fkey (*)
      `)
      .eq('bus_id', busId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllActiveTracking() {
    const { data, error } = await supabase
      .from('bus_tracking')
      .select(`
        *,
        buses (*),
        routes (*)
      `)
      .order('last_updated', { ascending: false });

    if (error) throw error;
    return data;
  },

  async upsertBusTracking(trackingData) {
    const { data, error } = await supabase
      .from('bus_tracking')
      .upsert(trackingData, { onConflict: 'bus_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrackingStatus(busId, status, delayMins = 0) {
    const { data, error } = await supabase
      .from('bus_tracking')
      .update({
        status,
        delay_mins: delayMins,
        last_updated: new Date().toISOString()
      })
      .eq('bus_id', busId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTracking(busId) {
    const { error } = await supabase
      .from('bus_tracking')
      .delete()
      .eq('bus_id', busId);

    if (error) throw error;
    return true;
  }
};

export default trackingModel;
