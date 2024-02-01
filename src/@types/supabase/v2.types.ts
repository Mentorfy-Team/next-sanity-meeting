export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      address: {
        Row: {
          city: string | null
          complement: string | null
          country: string | null
          created_at: string | null
          id: string
          neighborhood: string | null
          number: number | null
          state: string | null
          street: string | null
          zipcode: string | null
        }
        Insert: {
          city?: string | null
          complement?: string | null
          country?: string | null
          created_at?: string | null
          id: string
          neighborhood?: string | null
          number?: number | null
          state?: string | null
          street?: string | null
          zipcode?: string | null
        }
        Update: {
          city?: string | null
          complement?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          neighborhood?: string | null
          number?: number | null
          state?: string | null
          street?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      client_ai_history: {
        Row: {
          date_created: string | null
          details: Json | null
          id: number
          is_context: boolean | null
          output: Json | null
          profile: string | null
          query: string | null
          response: string | null
        }
        Insert: {
          date_created?: string | null
          details?: Json | null
          id?: number
          is_context?: boolean | null
          output?: Json | null
          profile?: string | null
          query?: string | null
          response?: string | null
        }
        Update: {
          date_created?: string | null
          details?: Json | null
          id?: number
          is_context?: boolean | null
          output?: Json | null
          profile?: string | null
          query?: string | null
          response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_ai_history_profile_foreign"
            columns: ["profile"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      client_input_tool: {
        Row: {
          created_at: string | null
          data: Json | null
          extra: Json | null
          feedback: Json | null
          id: string
          member_area_tool_id: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          extra?: Json | null
          feedback?: Json | null
          id?: string
          member_area_tool_id?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          extra?: Json | null
          feedback?: Json | null
          id?: string
          member_area_tool_id?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_input_tool_member_area_tool_id_fkey"
            columns: ["member_area_tool_id"]
            isOneToOne: false
            referencedRelation: "member_area_tool"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_input_tool_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      client_mentor: {
        Row: {
          client_id: string
          created_at: string
          id: string
          last_product_relation_at: string
          mentor_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          last_product_relation_at?: string
          mentor_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          last_product_relation_at?: string
          mentor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_mentor_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_mentor_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      client_product: {
        Row: {
          approved: boolean
          created_at: string | null
          customization: Json | null
          data: Json | null
          details: Json | null
          expires_at: string | null
          finishedAt: string | null
          id: string
          interval: string | null
          origin: string | null
          payed_price: number | null
          product_id: string | null
          status: string | null
          subscription: boolean | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          approved?: boolean
          created_at?: string | null
          customization?: Json | null
          data?: Json | null
          details?: Json | null
          expires_at?: string | null
          finishedAt?: string | null
          id?: string
          interval?: string | null
          origin?: string | null
          payed_price?: number | null
          product_id?: string | null
          status?: string | null
          subscription?: boolean | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          approved?: boolean
          created_at?: string | null
          customization?: Json | null
          data?: Json | null
          details?: Json | null
          expires_at?: string | null
          finishedAt?: string | null
          id?: string
          interval?: string | null
          origin?: string | null
          payed_price?: number | null
          product_id?: string | null
          status?: string | null
          subscription?: boolean | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_product_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      client_showcase: {
        Row: {
          background_color: string | null
          background_image: string | null
          color: string | null
          description: string | null
          id: string
          logo: string | null
          title: string | null
        }
        Insert: {
          background_color?: string | null
          background_image?: string | null
          color?: string | null
          description?: string | null
          id: string
          logo?: string | null
          title?: string | null
        }
        Update: {
          background_color?: string | null
          background_image?: string | null
          color?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_showcase_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      custom_domain: {
        Row: {
          date_created: string | null
          date_updated: string | null
          id: number
          name: string | null
          product_id: string | null
          profile_id: string | null
          record_type: string | null
          status: string
        }
        Insert: {
          date_created?: string | null
          date_updated?: string | null
          id?: number
          name?: string | null
          product_id?: string | null
          profile_id?: string | null
          record_type?: string | null
          status?: string
        }
        Update: {
          date_created?: string | null
          date_updated?: string | null
          id?: number
          name?: string | null
          product_id?: string | null
          profile_id?: string | null
          record_type?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_domain_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_domain_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_activity: {
        Row: {
          action: string
          collection: string
          comment: string | null
          id: number
          ip: string | null
          item: string
          origin: string | null
          timestamp: string
          user: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          collection: string
          comment?: string | null
          id?: number
          ip?: string | null
          item: string
          origin?: string | null
          timestamp?: string
          user?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          collection?: string
          comment?: string | null
          id?: number
          ip?: string | null
          item?: string
          origin?: string | null
          timestamp?: string
          user?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      directus_collections: {
        Row: {
          accountability: string | null
          archive_app_filter: boolean
          archive_field: string | null
          archive_value: string | null
          collapse: string
          collection: string
          color: string | null
          display_template: string | null
          group: string | null
          hidden: boolean
          icon: string | null
          item_duplication_fields: Json | null
          note: string | null
          preview_url: string | null
          singleton: boolean
          sort: number | null
          sort_field: string | null
          translations: Json | null
          unarchive_value: string | null
        }
        Insert: {
          accountability?: string | null
          archive_app_filter?: boolean
          archive_field?: string | null
          archive_value?: string | null
          collapse?: string
          collection: string
          color?: string | null
          display_template?: string | null
          group?: string | null
          hidden?: boolean
          icon?: string | null
          item_duplication_fields?: Json | null
          note?: string | null
          preview_url?: string | null
          singleton?: boolean
          sort?: number | null
          sort_field?: string | null
          translations?: Json | null
          unarchive_value?: string | null
        }
        Update: {
          accountability?: string | null
          archive_app_filter?: boolean
          archive_field?: string | null
          archive_value?: string | null
          collapse?: string
          collection?: string
          color?: string | null
          display_template?: string | null
          group?: string | null
          hidden?: boolean
          icon?: string | null
          item_duplication_fields?: Json | null
          note?: string | null
          preview_url?: string | null
          singleton?: boolean
          sort?: number | null
          sort_field?: string | null
          translations?: Json | null
          unarchive_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_collections_group_foreign"
            columns: ["group"]
            isOneToOne: false
            referencedRelation: "directus_collections"
            referencedColumns: ["collection"]
          }
        ]
      }
      directus_dashboards: {
        Row: {
          color: string | null
          date_created: string | null
          icon: string
          id: string
          name: string
          note: string | null
          user_created: string | null
        }
        Insert: {
          color?: string | null
          date_created?: string | null
          icon?: string
          id: string
          name: string
          note?: string | null
          user_created?: string | null
        }
        Update: {
          color?: string | null
          date_created?: string | null
          icon?: string
          id?: string
          name?: string
          note?: string | null
          user_created?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_dashboards_user_created_foreign"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_fields: {
        Row: {
          collection: string
          conditions: Json | null
          display: string | null
          display_options: Json | null
          field: string
          group: string | null
          hidden: boolean
          id: number
          interface: string | null
          note: string | null
          options: Json | null
          readonly: boolean
          required: boolean | null
          sort: number | null
          special: string | null
          translations: Json | null
          validation: Json | null
          validation_message: string | null
          width: string | null
        }
        Insert: {
          collection: string
          conditions?: Json | null
          display?: string | null
          display_options?: Json | null
          field: string
          group?: string | null
          hidden?: boolean
          id?: number
          interface?: string | null
          note?: string | null
          options?: Json | null
          readonly?: boolean
          required?: boolean | null
          sort?: number | null
          special?: string | null
          translations?: Json | null
          validation?: Json | null
          validation_message?: string | null
          width?: string | null
        }
        Update: {
          collection?: string
          conditions?: Json | null
          display?: string | null
          display_options?: Json | null
          field?: string
          group?: string | null
          hidden?: boolean
          id?: number
          interface?: string | null
          note?: string | null
          options?: Json | null
          readonly?: boolean
          required?: boolean | null
          sort?: number | null
          special?: string | null
          translations?: Json | null
          validation?: Json | null
          validation_message?: string | null
          width?: string | null
        }
        Relationships: []
      }
      directus_files: {
        Row: {
          charset: string | null
          description: string | null
          duration: number | null
          embed: string | null
          filename_disk: string | null
          filename_download: string
          filesize: number | null
          folder: string | null
          height: number | null
          id: string
          location: string | null
          metadata: Json | null
          modified_by: string | null
          modified_on: string
          storage: string
          tags: string | null
          title: string | null
          type: string | null
          uploaded_by: string | null
          uploaded_on: string
          width: number | null
        }
        Insert: {
          charset?: string | null
          description?: string | null
          duration?: number | null
          embed?: string | null
          filename_disk?: string | null
          filename_download: string
          filesize?: number | null
          folder?: string | null
          height?: number | null
          id: string
          location?: string | null
          metadata?: Json | null
          modified_by?: string | null
          modified_on?: string
          storage: string
          tags?: string | null
          title?: string | null
          type?: string | null
          uploaded_by?: string | null
          uploaded_on?: string
          width?: number | null
        }
        Update: {
          charset?: string | null
          description?: string | null
          duration?: number | null
          embed?: string | null
          filename_disk?: string | null
          filename_download?: string
          filesize?: number | null
          folder?: string | null
          height?: number | null
          id?: string
          location?: string | null
          metadata?: Json | null
          modified_by?: string | null
          modified_on?: string
          storage?: string
          tags?: string | null
          title?: string | null
          type?: string | null
          uploaded_by?: string | null
          uploaded_on?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_files_folder_foreign"
            columns: ["folder"]
            isOneToOne: false
            referencedRelation: "directus_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_files_modified_by_foreign"
            columns: ["modified_by"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_files_uploaded_by_foreign"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_flows: {
        Row: {
          accountability: string | null
          color: string | null
          date_created: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          operation: string | null
          options: Json | null
          status: string
          trigger: string | null
          user_created: string | null
        }
        Insert: {
          accountability?: string | null
          color?: string | null
          date_created?: string | null
          description?: string | null
          icon?: string | null
          id: string
          name: string
          operation?: string | null
          options?: Json | null
          status?: string
          trigger?: string | null
          user_created?: string | null
        }
        Update: {
          accountability?: string | null
          color?: string | null
          date_created?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          operation?: string | null
          options?: Json | null
          status?: string
          trigger?: string | null
          user_created?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_flows_user_created_foreign"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_folders: {
        Row: {
          id: string
          name: string
          parent: string | null
        }
        Insert: {
          id: string
          name: string
          parent?: string | null
        }
        Update: {
          id?: string
          name?: string
          parent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_folders_parent_foreign"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "directus_folders"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_migrations: {
        Row: {
          name: string
          timestamp: string | null
          version: string
        }
        Insert: {
          name: string
          timestamp?: string | null
          version: string
        }
        Update: {
          name?: string
          timestamp?: string | null
          version?: string
        }
        Relationships: []
      }
      directus_notifications: {
        Row: {
          collection: string | null
          id: number
          item: string | null
          message: string | null
          recipient: string
          sender: string | null
          status: string | null
          subject: string
          timestamp: string | null
        }
        Insert: {
          collection?: string | null
          id?: number
          item?: string | null
          message?: string | null
          recipient: string
          sender?: string | null
          status?: string | null
          subject: string
          timestamp?: string | null
        }
        Update: {
          collection?: string | null
          id?: number
          item?: string | null
          message?: string | null
          recipient?: string
          sender?: string | null
          status?: string | null
          subject?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_notifications_recipient_foreign"
            columns: ["recipient"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_notifications_sender_foreign"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_operations: {
        Row: {
          date_created: string | null
          flow: string
          id: string
          key: string
          name: string | null
          options: Json | null
          position_x: number
          position_y: number
          reject: string | null
          resolve: string | null
          type: string
          user_created: string | null
        }
        Insert: {
          date_created?: string | null
          flow: string
          id: string
          key: string
          name?: string | null
          options?: Json | null
          position_x: number
          position_y: number
          reject?: string | null
          resolve?: string | null
          type: string
          user_created?: string | null
        }
        Update: {
          date_created?: string | null
          flow?: string
          id?: string
          key?: string
          name?: string | null
          options?: Json | null
          position_x?: number
          position_y?: number
          reject?: string | null
          resolve?: string | null
          type?: string
          user_created?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_operations_flow_foreign"
            columns: ["flow"]
            isOneToOne: false
            referencedRelation: "directus_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_operations_reject_foreign"
            columns: ["reject"]
            isOneToOne: true
            referencedRelation: "directus_operations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_operations_resolve_foreign"
            columns: ["resolve"]
            isOneToOne: true
            referencedRelation: "directus_operations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_operations_user_created_foreign"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_panels: {
        Row: {
          color: string | null
          dashboard: string
          date_created: string | null
          height: number
          icon: string | null
          id: string
          name: string | null
          note: string | null
          options: Json | null
          position_x: number
          position_y: number
          show_header: boolean
          type: string
          user_created: string | null
          width: number
        }
        Insert: {
          color?: string | null
          dashboard: string
          date_created?: string | null
          height: number
          icon?: string | null
          id: string
          name?: string | null
          note?: string | null
          options?: Json | null
          position_x: number
          position_y: number
          show_header?: boolean
          type: string
          user_created?: string | null
          width: number
        }
        Update: {
          color?: string | null
          dashboard?: string
          date_created?: string | null
          height?: number
          icon?: string | null
          id?: string
          name?: string | null
          note?: string | null
          options?: Json | null
          position_x?: number
          position_y?: number
          show_header?: boolean
          type?: string
          user_created?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "directus_panels_dashboard_foreign"
            columns: ["dashboard"]
            isOneToOne: false
            referencedRelation: "directus_dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_panels_user_created_foreign"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_permissions: {
        Row: {
          action: string
          collection: string
          fields: string | null
          id: number
          permissions: Json | null
          presets: Json | null
          role: string | null
          validation: Json | null
        }
        Insert: {
          action: string
          collection: string
          fields?: string | null
          id?: number
          permissions?: Json | null
          presets?: Json | null
          role?: string | null
          validation?: Json | null
        }
        Update: {
          action?: string
          collection?: string
          fields?: string | null
          id?: number
          permissions?: Json | null
          presets?: Json | null
          role?: string | null
          validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_permissions_role_foreign"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "directus_roles"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_presets: {
        Row: {
          bookmark: string | null
          collection: string | null
          color: string | null
          filter: Json | null
          icon: string | null
          id: number
          layout: string | null
          layout_options: Json | null
          layout_query: Json | null
          refresh_interval: number | null
          role: string | null
          search: string | null
          user: string | null
        }
        Insert: {
          bookmark?: string | null
          collection?: string | null
          color?: string | null
          filter?: Json | null
          icon?: string | null
          id?: number
          layout?: string | null
          layout_options?: Json | null
          layout_query?: Json | null
          refresh_interval?: number | null
          role?: string | null
          search?: string | null
          user?: string | null
        }
        Update: {
          bookmark?: string | null
          collection?: string | null
          color?: string | null
          filter?: Json | null
          icon?: string | null
          id?: number
          layout?: string | null
          layout_options?: Json | null
          layout_query?: Json | null
          refresh_interval?: number | null
          role?: string | null
          search?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_presets_role_foreign"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "directus_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_presets_user_foreign"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_relations: {
        Row: {
          id: number
          junction_field: string | null
          many_collection: string
          many_field: string
          one_allowed_collections: string | null
          one_collection: string | null
          one_collection_field: string | null
          one_deselect_action: string
          one_field: string | null
          sort_field: string | null
        }
        Insert: {
          id?: number
          junction_field?: string | null
          many_collection: string
          many_field: string
          one_allowed_collections?: string | null
          one_collection?: string | null
          one_collection_field?: string | null
          one_deselect_action?: string
          one_field?: string | null
          sort_field?: string | null
        }
        Update: {
          id?: number
          junction_field?: string | null
          many_collection?: string
          many_field?: string
          one_allowed_collections?: string | null
          one_collection?: string | null
          one_collection_field?: string | null
          one_deselect_action?: string
          one_field?: string | null
          sort_field?: string | null
        }
        Relationships: []
      }
      directus_revisions: {
        Row: {
          activity: number
          collection: string
          data: Json | null
          delta: Json | null
          id: number
          item: string
          parent: number | null
        }
        Insert: {
          activity: number
          collection: string
          data?: Json | null
          delta?: Json | null
          id?: number
          item: string
          parent?: number | null
        }
        Update: {
          activity?: number
          collection?: string
          data?: Json | null
          delta?: Json | null
          id?: number
          item?: string
          parent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_revisions_activity_foreign"
            columns: ["activity"]
            isOneToOne: false
            referencedRelation: "directus_activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_revisions_parent_foreign"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "directus_revisions"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_roles: {
        Row: {
          admin_access: boolean
          app_access: boolean
          description: string | null
          enforce_tfa: boolean
          icon: string
          id: string
          ip_access: string | null
          name: string
        }
        Insert: {
          admin_access?: boolean
          app_access?: boolean
          description?: string | null
          enforce_tfa?: boolean
          icon?: string
          id: string
          ip_access?: string | null
          name: string
        }
        Update: {
          admin_access?: boolean
          app_access?: boolean
          description?: string | null
          enforce_tfa?: boolean
          icon?: string
          id?: string
          ip_access?: string | null
          name?: string
        }
        Relationships: []
      }
      directus_sessions: {
        Row: {
          expires: string
          ip: string | null
          origin: string | null
          share: string | null
          token: string
          user: string | null
          user_agent: string | null
        }
        Insert: {
          expires: string
          ip?: string | null
          origin?: string | null
          share?: string | null
          token: string
          user?: string | null
          user_agent?: string | null
        }
        Update: {
          expires?: string
          ip?: string | null
          origin?: string | null
          share?: string | null
          token?: string
          user?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_sessions_share_foreign"
            columns: ["share"]
            isOneToOne: false
            referencedRelation: "directus_shares"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_sessions_user_foreign"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_settings: {
        Row: {
          auth_login_attempts: number | null
          auth_password_policy: string | null
          basemaps: Json | null
          custom_aspect_ratios: Json | null
          custom_css: string | null
          default_language: string
          id: number
          mapbox_key: string | null
          module_bar: Json | null
          project_color: string | null
          project_descriptor: string | null
          project_logo: string | null
          project_name: string
          project_url: string | null
          public_background: string | null
          public_foreground: string | null
          public_note: string | null
          storage_asset_presets: Json | null
          storage_asset_transform: string | null
          storage_default_folder: string | null
        }
        Insert: {
          auth_login_attempts?: number | null
          auth_password_policy?: string | null
          basemaps?: Json | null
          custom_aspect_ratios?: Json | null
          custom_css?: string | null
          default_language?: string
          id?: number
          mapbox_key?: string | null
          module_bar?: Json | null
          project_color?: string | null
          project_descriptor?: string | null
          project_logo?: string | null
          project_name?: string
          project_url?: string | null
          public_background?: string | null
          public_foreground?: string | null
          public_note?: string | null
          storage_asset_presets?: Json | null
          storage_asset_transform?: string | null
          storage_default_folder?: string | null
        }
        Update: {
          auth_login_attempts?: number | null
          auth_password_policy?: string | null
          basemaps?: Json | null
          custom_aspect_ratios?: Json | null
          custom_css?: string | null
          default_language?: string
          id?: number
          mapbox_key?: string | null
          module_bar?: Json | null
          project_color?: string | null
          project_descriptor?: string | null
          project_logo?: string | null
          project_name?: string
          project_url?: string | null
          public_background?: string | null
          public_foreground?: string | null
          public_note?: string | null
          storage_asset_presets?: Json | null
          storage_asset_transform?: string | null
          storage_default_folder?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_settings_project_logo_foreign"
            columns: ["project_logo"]
            isOneToOne: false
            referencedRelation: "directus_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_settings_public_background_foreign"
            columns: ["public_background"]
            isOneToOne: false
            referencedRelation: "directus_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_settings_public_foreground_foreign"
            columns: ["public_foreground"]
            isOneToOne: false
            referencedRelation: "directus_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_settings_storage_default_folder_foreign"
            columns: ["storage_default_folder"]
            isOneToOne: false
            referencedRelation: "directus_folders"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_shares: {
        Row: {
          collection: string
          date_created: string | null
          date_end: string | null
          date_start: string | null
          id: string
          item: string
          max_uses: number | null
          name: string | null
          password: string | null
          role: string | null
          times_used: number | null
          user_created: string | null
        }
        Insert: {
          collection: string
          date_created?: string | null
          date_end?: string | null
          date_start?: string | null
          id: string
          item: string
          max_uses?: number | null
          name?: string | null
          password?: string | null
          role?: string | null
          times_used?: number | null
          user_created?: string | null
        }
        Update: {
          collection?: string
          date_created?: string | null
          date_end?: string | null
          date_start?: string | null
          id?: string
          item?: string
          max_uses?: number | null
          name?: string | null
          password?: string | null
          role?: string | null
          times_used?: number | null
          user_created?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_shares_collection_foreign"
            columns: ["collection"]
            isOneToOne: false
            referencedRelation: "directus_collections"
            referencedColumns: ["collection"]
          },
          {
            foreignKeyName: "directus_shares_role_foreign"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "directus_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "directus_shares_user_created_foreign"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_translations: {
        Row: {
          id: string
          key: string
          language: string
          value: string
        }
        Insert: {
          id: string
          key: string
          language: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          language?: string
          value?: string
        }
        Relationships: []
      }
      directus_users: {
        Row: {
          auth_data: Json | null
          avatar: string | null
          description: string | null
          email: string | null
          email_notifications: boolean | null
          external_identifier: string | null
          first_name: string | null
          id: string
          language: string | null
          last_access: string | null
          last_name: string | null
          last_page: string | null
          location: string | null
          password: string | null
          provider: string
          role: string | null
          status: string
          tags: Json | null
          tfa_secret: string | null
          theme: string | null
          title: string | null
          token: string | null
        }
        Insert: {
          auth_data?: Json | null
          avatar?: string | null
          description?: string | null
          email?: string | null
          email_notifications?: boolean | null
          external_identifier?: string | null
          first_name?: string | null
          id: string
          language?: string | null
          last_access?: string | null
          last_name?: string | null
          last_page?: string | null
          location?: string | null
          password?: string | null
          provider?: string
          role?: string | null
          status?: string
          tags?: Json | null
          tfa_secret?: string | null
          theme?: string | null
          title?: string | null
          token?: string | null
        }
        Update: {
          auth_data?: Json | null
          avatar?: string | null
          description?: string | null
          email?: string | null
          email_notifications?: boolean | null
          external_identifier?: string | null
          first_name?: string | null
          id?: string
          language?: string | null
          last_access?: string | null
          last_name?: string | null
          last_page?: string | null
          location?: string | null
          password?: string | null
          provider?: string
          role?: string | null
          status?: string
          tags?: Json | null
          tfa_secret?: string | null
          theme?: string | null
          title?: string | null
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "directus_users_role_foreign"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "directus_roles"
            referencedColumns: ["id"]
          }
        ]
      }
      directus_webhooks: {
        Row: {
          actions: string
          collections: string
          data: boolean
          headers: Json | null
          id: number
          method: string
          name: string
          status: string
          url: string
        }
        Insert: {
          actions: string
          collections: string
          data?: boolean
          headers?: Json | null
          id?: number
          method?: string
          name: string
          status?: string
          url: string
        }
        Update: {
          actions?: string
          collections?: string
          data?: boolean
          headers?: Json | null
          id?: number
          method?: string
          name?: string
          status?: string
          url?: string
        }
        Relationships: []
      }
      form: {
        Row: {
          date_created: string | null
          id: number
          name: string | null
          on_success: string | null
          on_success_message: string | null
          on_success_redirect_link: string | null
          page: string | null
          status: string
          user_created: string | null
        }
        Insert: {
          date_created?: string | null
          id?: number
          name?: string | null
          on_success?: string | null
          on_success_message?: string | null
          on_success_redirect_link?: string | null
          page?: string | null
          status?: string
          user_created?: string | null
        }
        Update: {
          date_created?: string | null
          id?: number
          name?: string | null
          on_success?: string | null
          on_success_message?: string | null
          on_success_redirect_link?: string | null
          page?: string | null
          status?: string
          user_created?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_user_created_fkey"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      form_components: {
        Row: {
          choices: Json | null
          col_span: number | null
          component_props: Json | null
          form_id: number | null
          id: number
          key: string | null
          label: string | null
          required: boolean | null
          type: string | null
        }
        Insert: {
          choices?: Json | null
          col_span?: number | null
          component_props?: Json | null
          form_id?: number | null
          id?: number
          key?: string | null
          label?: string | null
          required?: boolean | null
          type?: string | null
        }
        Update: {
          choices?: Json | null
          col_span?: number | null
          component_props?: Json | null
          form_id?: number | null
          id?: number
          key?: string | null
          label?: string | null
          required?: boolean | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_components_form_id_foreign"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          }
        ]
      }
      form_submits: {
        Row: {
          created_at: string | null
          elements: Json | null
          form_id: number | null
          id: number
          profile_id: string | null
          tags: Json | null
        }
        Insert: {
          created_at?: string | null
          elements?: Json | null
          form_id?: number | null
          id?: number
          profile_id?: string | null
          tags?: Json | null
        }
        Update: {
          created_at?: string | null
          elements?: Json | null
          form_id?: number | null
          id?: number
          profile_id?: string | null
          tags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submits_form_id_foreign"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "form"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_submits_profile_id_foreign"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      integration_token: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          token: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          token: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          token?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_token_product_id_foreign"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          }
        ]
      }
      lead_approval: {
        Row: {
          comments: string | null
          date_created: string | null
          date_updated: string | null
          email: string | null
          form: number | null
          fullname: string | null
          guidence: string | null
          id: string
          phone: string | null
          profit: string | null
          rating: string | null
          sort: number | null
          status: string
          trial_expiration: string | null
        }
        Insert: {
          comments?: string | null
          date_created?: string | null
          date_updated?: string | null
          email?: string | null
          form?: number | null
          fullname?: string | null
          guidence?: string | null
          id?: string
          phone?: string | null
          profit?: string | null
          rating?: string | null
          sort?: number | null
          status?: string
          trial_expiration?: string | null
        }
        Update: {
          comments?: string | null
          date_created?: string | null
          date_updated?: string | null
          email?: string | null
          form?: number | null
          fullname?: string | null
          guidence?: string | null
          id?: string
          phone?: string | null
          profit?: string | null
          rating?: string | null
          sort?: number | null
          status?: string
          trial_expiration?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_approval_form_foreign"
            columns: ["form"]
            isOneToOne: true
            referencedRelation: "form_submits"
            referencedColumns: ["id"]
          }
        ]
      }
      log_type: {
        Row: {
          code: number
          created_at: string | null
          description: string | null
          title: string | null
        }
        Insert: {
          code: number
          created_at?: string | null
          description?: string | null
          title?: string | null
        }
        Update: {
          code?: number
          created_at?: string | null
          description?: string | null
          title?: string | null
        }
        Relationships: []
      }
      meeting: {
        Row: {
          appointment_date: string | null
          appointment_finished_at: string | null
          attendees: Json | null
          configs: Json | null
          date_created: string | null
          date_updated: string | null
          duration: string | null
          friendly_id: string | null
          id: string
          invite_url: string | null
          owner_id: string
          recording_url: string | null
          room_name: string | null
          sort: number | null
          status: string
          type: string | null
          url: string | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_finished_at?: string | null
          attendees?: Json | null
          configs?: Json | null
          date_created?: string | null
          date_updated?: string | null
          duration?: string | null
          friendly_id?: string | null
          id?: string
          invite_url?: string | null
          owner_id: string
          recording_url?: string | null
          room_name?: string | null
          sort?: number | null
          status?: string
          type?: string | null
          url?: string | null
        }
        Update: {
          appointment_date?: string | null
          appointment_finished_at?: string | null
          attendees?: Json | null
          configs?: Json | null
          date_created?: string | null
          date_updated?: string | null
          duration?: string | null
          friendly_id?: string | null
          id?: string
          invite_url?: string | null
          owner_id?: string
          recording_url?: string | null
          room_name?: string | null
          sort?: number | null
          status?: string
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      meeting_profile: {
        Row: {
          id: number
          meeting_id: string | null
          profile_id: string | null
        }
        Insert: {
          id?: number
          meeting_id?: string | null
          profile_id?: string | null
        }
        Update: {
          id?: number
          meeting_id?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meeting_profile_meeting_id_foreign"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_profile_profile_id_foreign"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      member_area: {
        Row: {
          created_at: string | null
          id: string
          type_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          type_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_area_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "member_area_type"
            referencedColumns: ["id"]
          }
        ]
      }
      member_area_files: {
        Row: {
          created_at: string | null
          id: string
          ref_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ref_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ref_id?: string
          url?: string
        }
        Relationships: []
      }
      member_area_tool: {
        Row: {
          created_at: string | null
          data: Json | null
          description: string | null
          extra: Json | null
          id: string
          member_area: string | null
          order: number | null
          parent: string | null
          status: boolean | null
          title: string | null
          type: number
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          extra?: Json | null
          id?: string
          member_area?: string | null
          order?: number | null
          parent?: string | null
          status?: boolean | null
          title?: string | null
          type: number
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          description?: string | null
          extra?: Json | null
          id?: string
          member_area?: string | null
          order?: number | null
          parent?: string | null
          status?: boolean | null
          title?: string | null
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "member_area_tool_parent_fkey"
            columns: ["parent"]
            isOneToOne: false
            referencedRelation: "member_area_tool"
            referencedColumns: ["id"]
          }
        ]
      }
      member_area_type: {
        Row: {
          created_at: string | null
          id: number
          image: string | null
          name: string
          path: string | null
          tooltypes: number[] | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image?: string | null
          name: string
          path?: string | null
          tooltypes?: number[] | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image?: string | null
          name?: string
          path?: string | null
          tooltypes?: number[] | null
        }
        Relationships: []
      }
      mentor_tool: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image: string | null
          name: string
          order: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          name: string
          order?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string | null
          name?: string
          order?: number
        }
        Relationships: []
      }
      mentorfy_config: {
        Row: {
          active: boolean | null
          date_created: string | null
          date_updated: string | null
          id: number
          name: string | null
          sort: number | null
        }
        Insert: {
          active?: boolean | null
          date_created?: string | null
          date_updated?: string | null
          id?: number
          name?: string | null
          sort?: number | null
        }
        Update: {
          active?: boolean | null
          date_created?: string | null
          date_updated?: string | null
          id?: number
          name?: string | null
          sort?: number | null
        }
        Relationships: []
      }
      mentorfy_config_files: {
        Row: {
          directus_files_id: string | null
          id: number
          mentorfy_config_id: number | null
        }
        Insert: {
          directus_files_id?: string | null
          id?: number
          mentorfy_config_id?: number | null
        }
        Update: {
          directus_files_id?: string | null
          id?: number
          mentorfy_config_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorfy_config_files_directus_files_id_foreign"
            columns: ["directus_files_id"]
            isOneToOne: false
            referencedRelation: "directus_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorfy_config_files_mentorfy_config_id_foreign"
            columns: ["mentorfy_config_id"]
            isOneToOne: false
            referencedRelation: "mentorfy_config"
            referencedColumns: ["id"]
          }
        ]
      }
      mentorfy_pages: {
        Row: {
          content: string | null
          date_created: string | null
          date_updated: string | null
          id: number
          slug: string | null
          sort: number | null
          status: string
          title: string | null
          user_created: string | null
          user_updated: string | null
        }
        Insert: {
          content?: string | null
          date_created?: string | null
          date_updated?: string | null
          id?: number
          slug?: string | null
          sort?: number | null
          status?: string
          title?: string | null
          user_created?: string | null
          user_updated?: string | null
        }
        Update: {
          content?: string | null
          date_created?: string | null
          date_updated?: string | null
          id?: number
          slug?: string | null
          sort?: number | null
          status?: string
          title?: string | null
          user_created?: string | null
          user_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorfy_pages_user_created_foreign"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorfy_pages_user_updated_foreign"
            columns: ["user_updated"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      mentorfy_plans: {
        Row: {
          billing_type: string
          created_at: string | null
          currency: string
          description: string
          id: string
          installments: Json | null
          interval: string
          interval_count: number
          items: Json | null
          mentorfy_url: string | null
          metadata: Json
          name: string
          pagarme_id: string | null
          payment_methods: Json
          price: string | null
          price_id: string | null
          sort: number | null
          statement_descriptor: string
          status: string | null
          updated_at: string | null
          url: string | null
          user_created: string | null
          visibility: boolean | null
        }
        Insert: {
          billing_type?: string
          created_at?: string | null
          currency?: string
          description?: string
          id?: string
          installments?: Json | null
          interval?: string
          interval_count?: number
          items?: Json | null
          mentorfy_url?: string | null
          metadata?: Json
          name?: string
          pagarme_id?: string | null
          payment_methods?: Json
          price?: string | null
          price_id?: string | null
          sort?: number | null
          statement_descriptor?: string
          status?: string | null
          updated_at?: string | null
          url?: string | null
          user_created?: string | null
          visibility?: boolean | null
        }
        Update: {
          billing_type?: string
          created_at?: string | null
          currency?: string
          description?: string
          id?: string
          installments?: Json | null
          interval?: string
          interval_count?: number
          items?: Json | null
          mentorfy_url?: string | null
          metadata?: Json
          name?: string
          pagarme_id?: string | null
          payment_methods?: Json
          price?: string | null
          price_id?: string | null
          sort?: number | null
          statement_descriptor?: string
          status?: string | null
          updated_at?: string | null
          url?: string | null
          user_created?: string | null
          visibility?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorfy_plans_user_created_fkey"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      permission_model: {
        Row: {
          active: boolean | null
          date_created: string | null
          date_updated: string | null
          id: string
          permissions: string | null
          tag: string | null
          title: string | null
          user_created: string | null
          user_updated: string | null
        }
        Insert: {
          active?: boolean | null
          date_created?: string | null
          date_updated?: string | null
          id: string
          permissions?: string | null
          tag?: string | null
          title?: string | null
          user_created?: string | null
          user_updated?: string | null
        }
        Update: {
          active?: boolean | null
          date_created?: string | null
          date_updated?: string | null
          id?: string
          permissions?: string | null
          tag?: string | null
          title?: string | null
          user_created?: string | null
          user_updated?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permission_model_user_created_fkey"
            columns: ["user_created"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_model_user_updated_fkey"
            columns: ["user_updated"]
            isOneToOne: false
            referencedRelation: "directus_users"
            referencedColumns: ["id"]
          }
        ]
      }
      product: {
        Row: {
          access_link: string | null
          background_color: string | null
          background_image: string | null
          banner_image: string | null
          certificate: Json | null
          contact: string | null
          created_at: string | null
          deliver: number | null
          description: string | null
          extra: Json | null
          extra_image: string | null
          id: string
          is_free: boolean | null
          logo_image: string | null
          main_color: string | null
          main_image: string | null
          member_area: string | null
          order: number | null
          owner: string
          price: number | null
          private: boolean | null
          refeerer: string | null
          sellpage: string | null
          status: boolean | null
          title: string
          video: string | null
        }
        Insert: {
          access_link?: string | null
          background_color?: string | null
          background_image?: string | null
          banner_image?: string | null
          certificate?: Json | null
          contact?: string | null
          created_at?: string | null
          deliver?: number | null
          description?: string | null
          extra?: Json | null
          extra_image?: string | null
          id?: string
          is_free?: boolean | null
          logo_image?: string | null
          main_color?: string | null
          main_image?: string | null
          member_area?: string | null
          order?: number | null
          owner: string
          price?: number | null
          private?: boolean | null
          refeerer?: string | null
          sellpage?: string | null
          status?: boolean | null
          title?: string
          video?: string | null
        }
        Update: {
          access_link?: string | null
          background_color?: string | null
          background_image?: string | null
          banner_image?: string | null
          certificate?: Json | null
          contact?: string | null
          created_at?: string | null
          deliver?: number | null
          description?: string | null
          extra?: Json | null
          extra_image?: string | null
          id?: string
          is_free?: boolean | null
          logo_image?: string | null
          main_color?: string | null
          main_image?: string | null
          member_area?: string | null
          order?: number | null
          owner?: string
          price?: number | null
          private?: boolean | null
          refeerer?: string | null
          sellpage?: string | null
          status?: boolean | null
          title?: string
          video?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_deliver_fkey"
            columns: ["deliver"]
            isOneToOne: false
            referencedRelation: "member_area_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_member_area_fkey"
            columns: ["member_area"]
            isOneToOne: false
            referencedRelation: "member_area"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      profile: {
        Row: {
          access_type: string | null
          active: boolean | null
          avatar: string | null
          card_id: string | null
          comment: string | null
          created_at: string | null
          customer_id: string | null
          document: string | null
          email: string | null
          expiration_date: string | null
          guidance: boolean | null
          id: string
          interval: string | null
          lead_id: string | null
          meeting_token: string | null
          meeting_user_id: string | null
          name: string | null
          phone: string | null
          plan: string | null
          plan_id: string | null
          refeerer: string | null
          subscription_id: string | null
          zendesk_id: string | null
        }
        Insert: {
          access_type?: string | null
          active?: boolean | null
          avatar?: string | null
          card_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          document?: string | null
          email?: string | null
          expiration_date?: string | null
          guidance?: boolean | null
          id?: string
          interval?: string | null
          lead_id?: string | null
          meeting_token?: string | null
          meeting_user_id?: string | null
          name?: string | null
          phone?: string | null
          plan?: string | null
          plan_id?: string | null
          refeerer?: string | null
          subscription_id?: string | null
          zendesk_id?: string | null
        }
        Update: {
          access_type?: string | null
          active?: boolean | null
          avatar?: string | null
          card_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          document?: string | null
          email?: string | null
          expiration_date?: string | null
          guidance?: boolean | null
          id?: string
          interval?: string | null
          lead_id?: string | null
          meeting_token?: string | null
          meeting_user_id?: string | null
          name?: string | null
          phone?: string | null
          plan?: string | null
          plan_id?: string | null
          refeerer?: string | null
          subscription_id?: string | null
          zendesk_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_history: {
        Row: {
          code: number | null
          created_at: string | null
          description: string | null
          extra: Json | null
          id: string
          profile_id: string | null
          visibility: number | null
        }
        Insert: {
          code?: number | null
          created_at?: string | null
          description?: string | null
          extra?: Json | null
          id?: string
          profile_id?: string | null
          visibility?: number | null
        }
        Update: {
          code?: number | null
          created_at?: string | null
          description?: string | null
          extra?: Json | null
          id?: string
          profile_id?: string | null
          visibility?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_history_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "log_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "profile_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_notes: {
        Row: {
          created_at: string
          files: Json | null
          id: string
          mentor_id: string
          note: string | null
          profile_id: string
        }
        Insert: {
          created_at?: string
          files?: Json | null
          id?: string
          mentor_id: string
          note?: string | null
          profile_id: string
        }
        Update: {
          created_at?: string
          files?: Json | null
          id?: string
          mentor_id?: string
          note?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_notes_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_notes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_permissions: {
        Row: {
          data: Json | null
          id: string
          profile_id: string | null
          type: string | null
        }
        Insert: {
          data?: Json | null
          id?: string
          profile_id?: string | null
          type?: string | null
        }
        Update: {
          data?: Json | null
          id?: string
          profile_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_permissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      team: {
        Row: {
          created_at: string | null
          id: string
          owner_id: string
          products: string[]
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          owner_id: string
          products?: string[]
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          owner_id?: string
          products?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      team_member: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          team_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          team_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          }
        ]
      }
      team_member_client: {
        Row: {
          created_at: string | null
          id: number
          profile_id: string
          role: string
          team_member_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          profile_id: string
          role: string
          team_member_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          profile_id?: string
          role?: string
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_client_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_client_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_member"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
