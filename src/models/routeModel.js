import supabase from '../config/database.js';

export const routeModel = {
  async getAllRoutes() {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('route_number');

    if (error) throw error;
    return data;
  },

  async getActiveRoutes() {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('is_active', true)
      .order('route_number');

    if (error) throw error;
    return data;
  },

  async getRouteById(id) {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getRouteByNumber(routeNumber) {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('route_number', routeNumber)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getRouteWithStops(routeId) {
    const { data, error } = await supabase
      .from('routes')
      .select(`
        *,
        route_stops (
          id,
          stop_sequence,
          distance_from_start_km,
          estimated_time_from_start_mins,
          stops (*)
        )
      `)
      .eq('id', routeId)
      .order('route_stops.stop_sequence')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createRoute(routeData) {
    const { data, error } = await supabase
      .from('routes')
      .insert(routeData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRoute(id, routeData) {
    const { data, error } = await supabase
      .from('routes')
      .update(routeData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRoute(id) {
    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async searchRoutes(searchTerm) {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .or(`route_number.ilike.%${searchTerm}%,route_name.ilike.%${searchTerm}%,start_point.ilike.%${searchTerm}%,end_point.ilike.%${searchTerm}%`)
      .eq('is_active', true)
      .order('route_number');

    if (error) throw error;
    return data;
  }
};

export default routeModel;
