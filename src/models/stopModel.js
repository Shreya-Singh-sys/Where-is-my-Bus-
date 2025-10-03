import supabase from '../config/database.js';

export const stopModel = {
  async getAllStops() {
    const { data, error } = await supabase
      .from('stops')
      .select('*')
      .order('stop_name');

    if (error) throw error;
    return data;
  },

  async getStopById(id) {
    const { data, error } = await supabase
      .from('stops')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getStopByCode(stopCode) {
    const { data, error } = await supabase
      .from('stops')
      .select('*')
      .eq('stop_code', stopCode)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createStop(stopData) {
    const { data, error } = await supabase
      .from('stops')
      .insert(stopData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStop(id, stopData) {
    const { data, error } = await supabase
      .from('stops')
      .update(stopData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteStop(id) {
    const { error } = await supabase
      .from('stops')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async getNearbyStops(latitude, longitude, radiusKm = 1) {
    const { data, error } = await supabase.rpc('get_nearby_stops', {
      lat: latitude,
      lng: longitude,
      radius_km: radiusKm
    });

    if (error) throw error;
    return data;
  },

  async searchStops(searchTerm) {
    const { data, error } = await supabase
      .from('stops')
      .select('*')
      .or(`stop_name.ilike.%${searchTerm}%,stop_code.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
      .order('stop_name');

    if (error) throw error;
    return data;
  }
};

export default stopModel;
