import axios from "axios";
import crypto from "crypto";

export class BigBlueButtonAPI {
  private baseURL = "https://meet.mentorfy.io/bigbluebutton/api/";

  private generateChecksum(action: string, params: Record<string, any>): string {
    const secret = "IB1P1PTq3lxeY99WSMSkXbUVEIZwjMpiXHBBIjA"; // Your shared secret

    // Remove the checksum field if present, as it's what we're trying to calculate
    delete params['checksum'];

    // Use URLSearchParams for URL encoding
    const paramString = new URLSearchParams(params).toString();

    // Create the raw string by prepending the action and appending the secret
    const rawString = `${action}${paramString}${secret}`;
    // Generate the SHA-1 checksum
    const hash = crypto.createHash('sha1');
    hash.update(rawString);

    return hash.digest('hex');
  }

  async createRoom({
    meetingID,
    moderatorPW,
    guestPolicy,
    roomName,
    record,
    autoStartRecording,
    maxParticipants,
    logoutURL,
    duration,
    moderatorOnlyMessage,
    logo,
    bannerText,
    muteOnStart,
    learningDashboardEnabled,
    allowStartStopRecording,
    webcamsOnlyForModerator,
  }: {
    meetingID: string, moderatorPW?: string, guestPolicy?: string,
    roomName?: string, owner?: string
    record?: boolean, autoStartRecording?: boolean,
    maxParticipants?: number, logoutURL?: string,
    duration?: number, moderatorOnlyMessage?: string,
    logo?: string, bannerText?: string,
    muteOnStart?: boolean, learningDashboardEnabled?: boolean,
    allowStartStopRecording?: boolean, webcamsOnlyForModerator?: boolean,
  }) {
    const params = {
      duration: duration || 0,
      learningDashboardEnabled: learningDashboardEnabled || true,
      allowStartStopRecording: allowStartStopRecording || true,
      autoStartRecording: autoStartRecording || false,
      meetingID: meetingID,
      name: roomName,
      record: record || false,
      attendeePW: "ap",
      moderatorPW: moderatorPW || "mp",
      guestPolicy: guestPolicy || "ALWAYS_ACCEPT",
      learningDashboardCleanupDelayInMinutes: 60 * 24,
      allowModsToEjectCameras: true,
      allowRequestsWithoutSession: true,
      userCameraCap: 1,
      meetingCameraCap: 30,
      maxParticipants: maxParticipants || 10000,
      webcamsOnlyForModerator: webcamsOnlyForModerator || false,
      // welcome: "<br>Welcome to <b>%%CONFNAME%%</b>!",
      checksum: '',
    };

    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}create`, { params });
  }

  async joinAsModerator(fullName: string, meetingID: string) {
    const params = {
      fullName,
      meetingID,
      password: 'mp',
      redirect: false,
      checksum: '',
    };
    const checksum = this.generateChecksum("join", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}join`, { params });
  }

  async joinAsAttendee(fullName: string, meetingID: string, password?: string, isMod = false) {
    const params = {
      fullName,
      meetingID,
      role: isMod ? "MODERATOR" : "VIEWER",
      password: password || "ap",
      redirect: false,
      guest: true,
      checksum: '',
    };
    const checksum = this.generateChecksum("join", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}join`, { params });
  }

  async isMeetingRunning(meetingID: string) {
    const params = {
      meetingID,
      checksum: '',
    };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}isMeetingRunning`, { params });
  }

  async getMeetingInfo(meetingID: string) {
    const params = { meetingID, password: "mp", checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}getMeetingInfo`, { params });
  }

  async endMeeting(meetingID: string) {
    const params = { meetingID, password: "mp", checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}end`, { params });
  }

  async getMeetings() {
    const params = { checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}getMeetings`, { params });
  }

  async getDefaultConfigXML() {
    const params = { checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}getDefaultConfigXML`, { params });
  }

  // Para setConfigXML, enter, configXML e signOut, você provavelmente precisará de parâmetros adicionais.
  async setConfigXML(/* parâmetros */) {
    // Implementação aqui
  }

  async enter(/* parâmetros */) {
    // Implementação aqui
  }

  async configXML(/* parâmetros */) {
    // Implementação aqui
  }

  async signOut(/* parâmetros */) {
    // Implementação aqui
  }

  async getRecordings(meetingID: string, recordID: string) {
    const params = { meetingID, recordID, checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}getRecordings`, { params });
  }

  async publishRecordings(publish: boolean, recordID: string) {
    const params = { publish, recordID, checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}publishRecordings`, { params });
  }

  async deleteRecordings(recordID: string) {
    const params = { recordID, checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}deleteRecordings`, { params });
  }

  async updateRecordings(recordID: string) {
    const params = { recordID, checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}updateRecordings`, { params });
  }

  async getRecordingTextTracks(recordID: string) {
    const params = { recordID, checksum: '' };
    const checksum = this.generateChecksum("create", params);
    params['checksum'] = checksum;

    return await axios.get(`${this.baseURL}getRecordingTextTracks`, { params });
  }

  // Para chamadas mobile, você pode criar métodos separados ou usar os mesmos métodos de join com uma flag para mobile.
}

// // Uso
// const bbbAPI = new BigBlueButtonAPI();

// // Criar uma reunião
// bbbAPI.create("random-7790002", "fdd35ee6f20f43a503126267d827323a6dea8e8c");

// // Entrar como moderador
// bbbAPI.joinAsModerator("User 9638746", "random-7790002", "53bdb64abbef2d044c873efa70eabe6501d176e8");

// // Entrar como participante
// bbbAPI.joinAsAttendee("User 9638746", "random-7790002", "3110ff68e336060c0bef33d29789b5af9078cc8e");

// // Verificar se a reunião está acontecendo
// bbbAPI.isMeetingRunning("random-7790002", "5e9a5c29f478f4b02fd9e30cfd960aaed0d78bc0");

// // ... e assim por diante para outros métodos
